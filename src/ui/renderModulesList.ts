import fuzzysort from "fuzzysort";
import create from "./create";
import getSortedItems from "./getSortedItems";
import openFile from "./openFile";
import { Module } from "./useModules";

const renderModulesList = (
  output: HTMLElement,
  existingModules: Array<Module>,
  search?: string
) => {
  const results = getSortedItems(existingModules, search);
  Array.from(output.children).forEach((c) => c.remove());
  const list = create(
    "ul",
    { className: "list" },
    results.map((result) => {
      const liContent =
        result.score === -Infinity
          ? result.target
          : fuzzysort.highlight(result, '<span class="highlighted">', '</span>') ?? result.target;
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
  output.appendChild(list);
};

export default renderModulesList;
