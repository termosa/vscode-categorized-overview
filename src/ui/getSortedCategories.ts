import fuzzysort from "fuzzysort";
import { IModule } from "./useModules";

const getSortedCategories = (
  modules: Array<IModule>,
  search?: string
) => {
  return fuzzysort.go(
    search ?? "",
    [...new Set(modules.flatMap((item) => item.categories))],
    {
      all: true,
    }
  );
};

export default getSortedCategories;
