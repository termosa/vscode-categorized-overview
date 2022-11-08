import create from "./create";
import getSortedCategories from "./getSortedCategories";
import highlightContent from "./highlightContent";
import log from "./log";
import { IModule } from "./useModules";

const createCategoriesList = (
  modules: Array<IModule>,
  searchValue?: string
) => {
  const results = getSortedCategories(modules, searchValue);

  return create(
    "ul",
    { className: "list" },
    results.map((result) => {
      const liContent = highlightContent(result);
      const li = create(
        "li",
        {
          onclick: () => log(result.target),
        },
        []
      );
      li.innerHTML = `@${liContent}`;
      return li;
    })
  );
};

export default createCategoriesList;
