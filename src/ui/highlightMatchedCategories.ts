import create from "./create";
import { IModule } from "./useModules";

const highlightMatchedCategories = (
  module: IModule,
  requiredCategories: Array<Array<string>>
) => {
   return module.categories
    .map((category) => {
      for (const requiredCategory of requiredCategories) {
        if (requiredCategory.find((c) => c === category)) {
          return create("span", { className: "highlighted" }, [category]);
        }
      }
      return category;
    });
};

export default highlightMatchedCategories;
