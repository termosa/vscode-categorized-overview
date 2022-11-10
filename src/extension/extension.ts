import * as vscode from "vscode";
import modulesSearch from "./modulesSearch";
import ViewProvider from "./ViewProvider";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "categorizedOverview",
      new ViewProvider(context),
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("categorizedOverview.search", modulesSearch)
  );
}

export function deactivate() {}
