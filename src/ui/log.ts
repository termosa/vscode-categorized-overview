import vscodeApi from "./vscodeApi";

// TODO: Move overview's logger to an npm package and reuse it
const log = (text: unknown, type: "error" | "info" | "warning" = "info") => {
  vscodeApi.postMessage({
    command: "showMessage",
    type,
    text: JSON.stringify(text),
  });

  console.log(text);
};

export default log;
