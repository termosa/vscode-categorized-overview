import * as vscode from "vscode";
import renderHtml from "./renderHtml";
import sendModulesListToView from "./sendModulesListToView";

interface Message {
  command: "openFile" | "showMessage";
  text: string;
  type?: "error" | "info" | "warning";
}

class ViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _context: vscode.ExtensionContext) {}

  async resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
    };

    const viewModulesProcess = sendModulesListToView(webviewView.webview);
    webviewView.onDidDispose(() => {
      viewModulesProcess?.close();
    });

    this._context.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration((event) => {
        if (!event.affectsConfiguration("categorizedOverview") || !viewModulesProcess) return;
        viewModulesProcess.emit();
      })
    );

    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        viewModulesProcess?.reload();
        return;
      }
      viewModulesProcess?.close();
    });

    const messageListener = webviewView.webview.onDidReceiveMessage(
      (message: Message) => {
        switch (message.command) {
          case "openFile":
            const module = vscode.Uri.file(message.text);
            vscode.workspace
              .openTextDocument(module)
              .then((doc) => vscode.window.showTextDocument(doc));
            return;
          case "showMessage": {
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

    renderHtml(webviewView, this._context.extensionUri);
  }
}

export default ViewProvider;
