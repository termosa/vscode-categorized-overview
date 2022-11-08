import fuzzysort from "fuzzysort";
import create from "./create";
import createCategoriesList from "./createCategoriesList";
import createModulesList from "./createModulesList";
import getCategoryQuery from "./getCategoryQuery";
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

  let newModules = modules;

  // Get all cats
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
        // @ts-ignore
        create("span", {}, [`No matching category for "${category}"`])
      );
      return;
    }
    requiredCategories.push(result.map((r) => r.target));
  }

  newModules = modules.filter((module) => {
    return requiredCategories.every((elem) => {
      // @ts-ignore
      return module.categories.includes(...elem);
    });
  });

  const modulesQuery = target?.value.replace(categoryQueryRegEx, "").trim();
  const list = createModulesList(newModules, modulesQuery);

  if (!Array.from(list.children).length) {
    output.appendChild(
      // @ts-ignore
      create("span", {}, [`No modules matching "${modulesQuery}"`])
    );
    return;
  }

  output.appendChild(list);
};

export default renderOutputList;
