// @ts-nocheck
import List from "list.js";
let vscode = undefined;
if (typeof acquireVsCodeApi === "function") {
  // safe to use the function
  vscode = acquireVsCodeApi();
}
console.log('script is working')

/**
 * Replace console.log with vscode message print
 * @param {unknown} text
 * @param {'error' | 'info' | 'warning'} type
 */
const log = (text, type = "info") => {
  if (vscode) {
    vscode.postMessage({
      command: "log",
      type,
      text: JSON.stringify(text),
    });
    return;
  }

  console.log(text);
};

/**
 * @typedef {{
 *      path: string,
 *      name: string,
 *      categories: string[]
 * }} Module
 */

/**
 * @type {Module[]}
 */
let allModules = [];

const list = new List(
  "modules",
  {
    fuzzySearch: {
      threshold: 0.3,
    },
    valueNames: ["name", "category"],
    item: (
      /**
       * @type {Module}
       */
      module
    ) => {
      const categoriesEnumeration = module.categories.join(", ");
      return `<li title="${module.name} ${categoriesEnumeration ? `(${categoriesEnumeration})` : ""
        }">
            <span class="name">${module.name}</span>
            ${module.categories
          .map(
            (category) =>
              `<span class="category">
                    ${category}
                </span>`
          )
          .join(" ")}
        </li>`;
    },
  },
  []
);

/**
 *
 * @param {Module[]} modules
 * @returns {Module[]}
 */
const parseModuleCategories = (modules) => {
  return modules.map((module) => {
    if (!module.categories.length) return module;
    return {
      ...module,
      categories: module.categories.map((category) => "@" + category),
    };
  });
};

window.addEventListener(
  "message",
  (
    /**
     * @type {{ data: Module[] }}
     */
    event
  ) => {
    /**
     * @type {Module[]}
     */
    try {
      allModules = JSON.parse(event.data);
    } catch (err) {
      log(err, "error");
    }
    list.clear();
    list.add(parseModuleCategories(allModules));
  }
);

const modulesContainer = document.querySelector(".list");
const searchField = document.querySelector(".fuzzy-search");
const autoComplete = document.getElementById("autocomplete");

list.on("updated", () => {
  const target = searchField;
  const categoryQuery = (editable(target).match(/^@(\w*)$/) || [])[1];
  if (categoryQuery === undefined) {
    if (autoComplete && autoComplete.innerHTML) {
      hideAutoCompleteTab();
    }
    if (modulesContainer && !modulesContainer.innerHTML) {
      setTimeout(() => {
        list.add(parseModuleCategories(allModules));
      }, 60);
    }
    return;
  }

  list.clear();
  filterAutoCompleteValues(target.value, categoryQuery);
});

let lastCaretPosition;

const editable = (t) => {
  if (t.selectionStart !== t.selectionEnd) return "";
  const caret = t.selectionStart;
  lastCaretPosition = caret;
  if (caret === 0) return "";
  return t.value.slice(0, caret).match(/(^|\s)(\S*)$/)?.[2] || "";
};

/**
 *
 * @param {string[]} categories
 */
const updateAutoComplete = (categories) => {
  if (!autoComplete) return;

  autoComplete.innerHTML = categories
    .map((category) => `<li>${category}</li>`)
    .join("");

  if (autoComplete.innerHTML) {
    autoComplete.style.visibility = "visible";
  } else {
    autoComplete.style.visibility = "hidden";
  }
};

const hideAutoCompleteTab = () => updateAutoComplete([]);

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const filterAutoCompleteValues = (searchValue, categoryQuery) => {
  /**
   * Get list of all categories of visible modules
   */
  const allCats = [
    ...new Set(allModules.map((item) => item.categories).flat()),
  ].map((v) => `@${v}`);

  const selectedCategories = searchValue.match(/@(\w+)/g) || [];

  // const matchedCategories = list.visibleItems
  //   .map((item) => item.values().categories)
  //   .flat();

  /**
   * Get list of not selected categories
   * @type {string[] | undefined}
   */
  const availableCategories = allCats.filter(
    (category) => !selectedCategories.includes(category.toLocaleLowerCase())
  );

  updateAutoComplete(
    availableCategories.filter((category) =>
      new RegExp(categoryQuery.split("").map(escapeRegExp).join(".*")).test(
        category.toLocaleLowerCase()
      )
    )
  );
};

/**
 *
 * @param {string} searchString
 * @param {string} category
 * @returns {[string, number]}}
 */
function replaceSearchValue(searchString, category) {
  const startIndex = searchString.slice(0, lastCaretPosition).lastIndexOf("@");
  const endOfString = searchString.length;

  const newSearch =
    searchString.slice(0, startIndex) +
    category +
    " " +
    searchString.slice(lastCaretPosition, endOfString);

  return [newSearch, startIndex + category.length + 1];
}

const handleAutocomplete = (event) => {
  hideAutoCompleteTab();
  const selectedCategory = event.target?.innerText;
  const searchValue = searchField?.value;

  if (!selectedCategory || !searchValue || !searchField) return;

  const [newFieldValue, newPos] = replaceSearchValue(
    searchValue,
    selectedCategory
  );

  searchField.value = newFieldValue;
  searchField.dispatchEvent(new Event("keyup"));
  searchField.focus();
  searchField.setSelectionRange(newPos, newPos);
  list.trigger();
};

/**
 *
 * @param {Event} event
 * @returns
 */
const openModuleFile = (event) => {
  const fileName = event.target.children[0].innerText;
  const file = list.get("name", fileName)[0];
  if (!file) {
    log(`Cannot find matching module: ${fileName}`, "error");
    return;
  }

  if (vscode) {
    vscode.postMessage({
      command: "openModule",
      text: file.values().path,
    });
  } else {
    log({
      command: "openModule",
      text: file.values().path,
    });
  }
};

autoComplete?.addEventListener("click", handleAutocomplete);
modulesContainer?.addEventListener("click", openModuleFile);
