import fuzzysort from "fuzzysort";
import { Module } from "./useModules";

const getSortedItems = (existingModules: Array<Module>, search?: string) => {
  return fuzzysort.go(search ?? "", existingModules, {
    all: true,
    key: "name",
  });
};

export default getSortedItems;
