import vscode from "vscode";
import getModulesList from "./get-modules-list";

interface IModuleQuickPickItem extends vscode.QuickPickItem {
  path: string;
}

const modulesSearch = () => {
  const quickPickContainer = vscode.window.createQuickPick<IModuleQuickPickItem>();
  quickPickContainer.matchOnDescription = true;

  quickPickContainer.onDidChangeSelection((selection) => {
    if (selection[0] && selection[0].path) {
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.file(selection[0].path)
      );
    }
    quickPickContainer.dispose();
  });

  getModulesList((list) => {
    quickPickContainer.items = list.map((item) => ({
      label: item.name,
      description: item.categories.join(", "),
      path: item.path,
    }));
    quickPickContainer.show();
  });
};

export default modulesSearch;
