import fuzzysort from "fuzzysort";
import create from "./create";

const highlightContent = (result: Fuzzysort.Result) => {
  if (result.score === -Infinity) return [result.target];
  return (
    fuzzysort.highlight(result, (match) => {
      return create("span", { className: "highlighted" }, [match]);
    }) ?? [result.target]
  );
};

export default highlightContent;
