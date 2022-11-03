import * as vscode from "vscode";
import getModulesList from "./get-modules-list";
import getUri from "./get-uri";

interface Message {
  command: "openModule" | "log";
  text: string;
  type?: "error" | "info" | "warning";
}

class ViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  async resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
    };
    const scriptUri = getUri(webviewView.webview, this._extensionUri, [
      "src",
      "main.js",
    ]);
    const fuzzySearch = getUri(webviewView.webview, this._extensionUri, [
      "node_modules",
      "list.js",
      "dist",
      "list.min.js",
    ]);
    const stylesUri = getUri(webviewView.webview, this._extensionUri, [
      "src",
      "style.css",
    ]);

    getModulesList((list) => {
      webviewView.webview.postMessage(JSON.stringify(list));
    });

    const messageListener = webviewView.webview.onDidReceiveMessage(
      (message: Message) => {
        switch (message.command) {
          case "openModule":
            const module = vscode.Uri.file(message.text);
            vscode.workspace
              .openTextDocument(module)
              .then((doc) => vscode.window.showTextDocument(doc));
            return;
          case "log": {
            if (message.type === "error")
              vscode.window.showErrorMessage(message.text);
            if (message.type === "info")
              vscode.window.showInformationMessage(message.text);
            if (message.type === "warning")
              vscode.window.showWarningMessage(message.text);
            return;
          }
          default:
            vscode.window.showInformationMessage(JSON.stringify(message));
        }
      }
    );

    webviewView.onDidDispose(messageListener.dispose);

    webviewView.webview.html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="${stylesUri}">
      <title>Library</title>
    </head>
    <body>
      <div id="modules" class="modules">
        <input
          class="fuzzy-search"
          placeholder="Filter (use @ match categories)"
        ></input>
        <ul class="autocomplete" style="visibility: hidden;" id="autocomplete"></ul>
        <ul class="list"></ul>
      </div>
      <script src="${fuzzySearch}"></script>
      <script src="${scriptUri}"></script>
    </body>
    </html>`;
  }
}

export default ViewProvider;
