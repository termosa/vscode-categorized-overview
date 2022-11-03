import * as vscode from "vscode";
import getModulesList from "./get-modules-list";
import renderHtml from "./renderHtml";

interface Message {
  command: "openModule" | "log"; // TODO: "openFile" | "showMessage"
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

    renderHtml(webviewView, this._extensionUri);
  }
}

export default ViewProvider;
