import getModulesList from "./get-modules-list";
import vscode from "vscode";

const sendModulesListToView = (webview: vscode.Webview) => {
  getModulesList((list) => {
    webview.postMessage(JSON.stringify(list));
  });
};

export default sendModulesListToView;
