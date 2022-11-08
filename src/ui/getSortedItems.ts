import fuzzysort from "fuzzysort";
import { IModule } from "./useModules";

const getSortedItems = (modules: Array<IModule>, search?: string) => {
  return fuzzysort.go(search ?? "", modules, {
    all: true,
    key: "name",
  });
};

export default getSortedItems;
