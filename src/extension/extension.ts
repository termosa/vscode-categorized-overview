import * as vscode from "vscode";
import ViewProvider from "./ViewProvider";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (!event.affectsConfiguration("categorizedOverview")) return;
      vscode.window
        .showInformationMessage("Configuration changed, reload vscode to apply changes", "Reload now")
        .then((selection) => {
          if (selection !== "Reload now") return;
          vscode.commands.executeCommand("workbench.action.reloadWindow");
        });
    })
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "categorizedOverview",
      new ViewProvider(context.extensionUri),
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );
}

export function deactivate() {}
