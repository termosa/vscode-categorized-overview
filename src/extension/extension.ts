import * as vscode from "vscode";
import ViewProvider from "./ViewProvider";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "categorizedOverview",
      new ViewProvider(context.extensionUri),
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );
}

export function deactivate() {}