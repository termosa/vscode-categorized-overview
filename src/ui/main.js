"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const List = require("list.js");
let vscodeApi = null;
if (typeof acquireVsCodeApi === "function") {
    vscodeApi = acquireVsCodeApi();
}
const log = (text, type = "info") => {
    if (vscodeApi) {
        vscodeApi.postMessage({
            command: "showMessage",
            type,
            text: JSON.stringify(text),
        });
        return;
    }
    console.log(text);
};
let allModules = [];
const list = new List("modules", {
    fuzzySearch: {
        threshold: 0.3,
    },
    valueNames: ["name", "category"],
    // Documentation says it can accept a function, but the type says it can't 🤷‍♂️
    // https://listjs.com/api/#item
    // @ts-ignore
    item: (module) => {
        const categoriesEnumeration = module.categories.join(", ");
        return `<li title="${module.name} ${categoriesEnumeration ? `(${categoriesEnumeration})` : ""}">
            <span class="name">${module.name}</span>
            ${module.categories
            .map((category) => `<span class="category">
                    ${category}
                </span>`)
            .join(" ")}
        </li>`;
    },
}, []);
const parseModuleCategories = (modules) => {
    return modules.map((module) => {
        if (!module.categories.length)
            return module;
        return {
            ...module,
            categories: module.categories.map((category) => "@" + category),
        };
    });
};
function handleModulesUpdate(modules) {
    list.clear();
    list.add(parseModuleCategories(modules));
    allModules = modules;
}
window.addEventListener("message", (event) => {
    try {
        handleModulesUpdate(JSON.parse(event.data));
    }
    catch (err) {
        log(err, "error");
    }
});
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
let lastCaretPosition = null;
const editable = (t) => {
    if (t.selectionStart !== t.selectionEnd)
        return "";
    const caret = t.selectionStart;
    lastCaretPosition = caret;
    if (caret === null || caret === 0)
        return "";
    return t.value.slice(0, caret).match(/(^|\s)(\S*)$/)?.[2] || "";
};
const updateAutoComplete = (categories) => {
    if (!autoComplete)
        return;
    autoComplete.innerHTML = categories
        .map((category) => `<li>${category}</li>`)
        .join("");
    if (autoComplete.innerHTML) {
        autoComplete.style.visibility = "visible";
    }
    else {
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
    /**
     * Get list of not selected categories
     */
    const availableCategories = allCats.filter((category) => !selectedCategories.includes(category.toLocaleLowerCase()));
    updateAutoComplete(availableCategories.filter((category) => new RegExp(categoryQuery.split("").map(escapeRegExp).join(".*")).test(category.toLocaleLowerCase())));
};
function replaceSearchValue(searchString, category) {
    if (!lastCaretPosition) {
        log("lastCaretPosition isn't set", "error");
        return;
    }
    const startIndex = searchString.slice(0, lastCaretPosition).lastIndexOf("@");
    const endOfString = searchString.length;
    const newSearch = searchString.slice(0, startIndex) +
        category +
        " " +
        searchString.slice(lastCaretPosition, endOfString);
    return [newSearch, startIndex + category.length + 1];
}
const handleAutocomplete = (event) => {
    hideAutoCompleteTab();
    const selectedCategory = event.target?.innerText;
    const searchValue = searchField?.value;
    if (!selectedCategory || !searchValue || !searchField)
        return;
    const value = replaceSearchValue(searchValue, selectedCategory);
    if (!value)
        return;
    const [newFieldValue, newPos] = value;
    searchField.value = newFieldValue;
    searchField.dispatchEvent(new Event("keyup"));
    searchField.focus();
    searchField.setSelectionRange(newPos, newPos);
    list.update();
};
const openModuleFile = (event) => {
    const fileName = event.target.children[0].textContent;
    const file = list.get("name", fileName)[0];
    if (!file) {
        log(`Cannot find matching module: ${fileName}`, "error");
        return;
    }
    if (vscodeApi) {
        vscodeApi.postMessage({
            command: "openFile",
            text: file.values().path,
        });
    }
    else {
        log({
            command: "openFile",
            text: file.values().path,
        });
    }
};
autoComplete?.addEventListener("click", handleAutocomplete);
modulesContainer?.addEventListener("click", openModuleFile);
if (process.env.NODE_ENV === "development") {
    handleModulesUpdate([
        {
            path: "src/api/loadUser.tsx",
            name: "loadUser.tsx",
            categories: ["user", "api"],
        },
        {
            path: "src/api/loadMessages.tsx",
            name: "loadMessages.tsx",
            categories: ["messages", "api"],
        },
        {
            path: "src/api/login.tsx",
            name: "login.tsx",
            categories: ["auth", "api"],
        },
        {
            path: "src/api/logout.tsx",
            name: "logout.tsx",
            categories: ["auth", "api"],
        },
        {
            path: "src/components/HomePage.tsx",
            name: "HomePage.tsx",
            categories: ["page", "component"],
        },
        {
            path: "src/components/AboutUsPage.tsx",
            name: "AboutUsPage.tsx",
            categories: ["page", "component"],
        },
        {
            path: "src/components/SettingsPage.tsx",
            name: "SettingsPage.tsx",
            categories: ["settings", "page", "component"],
        },
        {
            path: "src/components/UserAvatar.tsx",
            name: "UserAvatar.tsx",
            categories: ["user", "component"],
        },
        {
            path: "src/components/UserAvatarInput.tsx",
            name: "UserAvatarInput.tsx",
            categories: ["user", "form", "component"],
        },
    ]);
}
//# sourceMappingURL=main.js.map