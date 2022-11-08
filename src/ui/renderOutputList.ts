import create from "./create";
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

  if (Array.from(list.children).length === 0) {
    // @ts-ignore
    const msg = categoryQuery === undefined ? create("span", {}, [`No modules matching "${target.value}"`]) : create("span", {}, [`No category matching "@${categoryQuery}"`]);
    output.appendChild(msg);
    return;
  }

  output.appendChild(list);
};

export default renderOutputList;
