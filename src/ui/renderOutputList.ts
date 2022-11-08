import createCategoriesList from "./createCategoriesList";
import createModulesList from "./createModulesList";
import getCategoryQuery from "./getCategoryQuery";
import { IModule } from "./useModules";

const renderOutputList = (
  output: HTMLElement,
  modules: Array<IModule>,
  target?: HTMLInputElement
) => {
  Array.from(output.children).forEach((c) => c.remove());

  const categoryQuery = getCategoryQuery(target);

  const list =
    categoryQuery === undefined
      ? createModulesList(modules, target?.value)
      : createCategoriesList(modules, categoryQuery);

  output.appendChild(list);
};

export default renderOutputList;
