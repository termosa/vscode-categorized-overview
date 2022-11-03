import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
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

    let styleFileName;
    let scriptFileName;
    const files = fs.readdirSync(path.join(__dirname, "view-front"));
    files.map((file) => {
      const styleFileMatch = file.match(/index\.[\d\w]+\.css/);
      const scriptFileMatch = file.match(/index\.[\d\w]+\.js/);
      if (styleFileMatch) {
        styleFileName = styleFileMatch[0];
      }
      if (scriptFileMatch) {
        scriptFileName = scriptFileMatch[0];
      }
    });

    if (!styleFileName) {
      throw Error("Can't find style file name");
    }
    if (!scriptFileName) {
      throw Error("Can't find script file name");
    }
    const stylesUri = getUri(webviewView.webview, this._extensionUri, [
      "out",
      "view-front",
      styleFileName,
    ]);
    const scriptUri = getUri(webviewView.webview, this._extensionUri, [
      "out",
      "view-front",
      scriptFileName,
    ]);
    const file = fs.readFileSync(
      path.join(__dirname, "view-front", "index.html"),
      "utf-8"
    );

    const newFile = file
      .replace(/\/index\.[\d\w]+\.js/g, `${scriptUri}`)
      .replace(/\/index\.[\d\w]+\.css/g, `${stylesUri}`);

    webviewView.webview.html = newFile;
  }
}

export default ViewProvider;
