import * as vscode from "vscode";
import ViewProvider from "./ViewProvider";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "library", // TODO: Rename to "Categorized Overview"
      new ViewProvider(context.extensionUri),
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );
}

export function deactivate() {}
