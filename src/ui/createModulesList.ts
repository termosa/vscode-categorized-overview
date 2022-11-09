import create from "./create";
import getSortedItems from "./getSortedItems";
import highlightContent from "./highlightContent";
import openFile from "./openFile";
import { IModule } from "./useModules";

const createModulesList = (modules: Array<IModule>, searchValue?: string) => {
  const results = getSortedItems(modules, searchValue);

  return create(
    "ul",
    { className: "list" },
    results.map((result) => {
      const allCategories = result.obj.categories.join(", ");
      const liContent = highlightContent(result);
      return create(
        "li",
        {
          onclick: () => openFile(result.obj.path),
          title: `${result.obj.name} ${
            allCategories ? `(${allCategories})` : ""
          }`,
        },
        [
          create("span", {}, liContent),
          " ",
          create(
            "span",
            {
              className: "categories",
              innerHTML: result.obj.categoriesHtmlLayout ?? allCategories,
            },
            []
          ),
        ]
      );
    })
  );
};

export default createModulesList;
