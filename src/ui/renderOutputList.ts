import fuzzysort from "fuzzysort";
import create from "./create";
import createModulesList from "./createModulesList";
import filterModulesByRequiredCategories from "./filterModulesByRequiredCategories";
import { IModule } from "./useModules";

const categoryQueryRegEx = /@\w*/g;
const extractCategories = (search: string) => {
  return (search.match(categoryQueryRegEx) || [])
    .map((c) => c.replace("@", ""))
    .filter(Boolean);
};

const renderOutputList = (
  output: HTMLElement,
  modules: Array<IModule>,
  target?: HTMLInputElement
) => {
  Array.from(output.children).forEach((c) => c.remove());
  modules.map((m) => (delete m.categoriesLayout));

  // Get all cats from the search
  const categoriesSearch = extractCategories(target?.value || "");
  const requiredCategories: Array<Array<string>> = [];

  // Run fuzzy search on each cat
  for (const category of categoriesSearch) {
    const result = fuzzysort.go(category, [
      ...new Set(modules.flatMap((item) => item.categories)),
    ]);
    // If fuzzy search returns nothing show message and stop searching
    if (!result.length) {
      output.appendChild(
        create("span", {}, [`No matching category for "${category}"`])
      );
      return;
    }
    requiredCategories.push(result.map((r) => r.target));
  }

  const modulesQuery = target?.value.replace(categoryQueryRegEx, "").trim();
  const list = createModulesList(
    filterModulesByRequiredCategories(modules, requiredCategories),
    modulesQuery
  );

  if (!Array.from(list.children).length) {
    output.appendChild(
      create("span", {}, [`No modules matching "${modulesQuery}"`])
    );
    return;
  }

  output.appendChild(list);
};

export default renderOutputList;
