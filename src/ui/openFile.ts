import vscodeApi from "./vscodeApi";

const openFile = (path: string) => {
  vscodeApi.postMessage({
    command: "openFile",
    text: path,
  });
};

export default openFile;
