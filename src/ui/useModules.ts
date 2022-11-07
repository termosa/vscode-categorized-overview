export interface Module {
  path: string;
  name: string;
  categories: string[];
}

const useModules = () => {
  let modules: Array<Module>;
  return {
    set: (newModules: Array<Module>) => {
      modules = newModules;
    },
    get: () => modules,
  };
};

export default useModules;
