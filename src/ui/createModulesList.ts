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
      const liContent = highlightContent(result);
      const li = create(
        "li",
        {
          onclick: () => openFile(result.obj.path),
        },
        []
      );
      li.innerHTML = liContent;
      return li;
    })
  );
};

export default createModulesList;
