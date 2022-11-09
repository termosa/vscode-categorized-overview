export const categoryQueryRegEx = /@\w*/g;

const extractCategories = (search: string) => {
  return (search.match(categoryQueryRegEx) || [])
    .map((c) => c.replace("@", ""))
    .filter(Boolean);
};

export default extractCategories;
