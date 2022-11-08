import fuzzysort from "fuzzysort";

const highlightContent = (result: Fuzzysort.Result) => {
  if (result.score === -Infinity) return result.target;
  return (
    fuzzysort.highlight(result, '<span class="highlighted">', "</span>") ??
    result.target
  );
};

export default highlightContent;
