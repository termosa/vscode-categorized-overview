import { IModule } from "./useModules";

const highlightMatchedCategories = (
  module: IModule,
  requiredCategories: Array<Array<string>>
) => {
  module.categoriesHtmlLayout = module.categories.map((category) => {
    for (const requiredCategory of requiredCategories) {
      if (requiredCategory.find((c) => c === category)) {
        // TODO: Think how to replace it with create() function and keep commas
        return `<span class="selectedCategory">${category}</span>`;
      }
    }
    return category;
  }).join(', ');
};

export default highlightMatchedCategories;
