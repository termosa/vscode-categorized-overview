export interface IModule {
  path: string;
  name: string;
  categories: Array<string>;
  categoriesLayout?: Array<string | HTMLElement>;
}

const useModules = () => {
  let modules: Array<IModule>;
  return {
    set: (newModules: Array<IModule>) => {
      modules = newModules;
    },
    get: () => modules,
  };
};

export default useModules;
