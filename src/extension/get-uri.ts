import * as vscode from "vscode";

const getUri = (
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  pathList: Array<string>
) => {
  return webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, ...pathList)
  );
};

export default getUri;
