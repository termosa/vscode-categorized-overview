import highlightMatchedCategories from "./highlightMatchedCategories";
import { IModule } from "./useModules";

const filterModulesByRequiredCategories = (
  modules: Array<IModule>,
  requiredCategories: Array<Array<string>>
) => {
  return modules.filter((module) => {
    return requiredCategories.every((elements) => {
      for (const element of elements) {
        if (module.categories.includes(element)) {
          module.categoriesLayout = highlightMatchedCategories(
            module,
            requiredCategories
          );
          return true;
        }
      }
    });
  });
};

export default filterModulesByRequiredCategories;
