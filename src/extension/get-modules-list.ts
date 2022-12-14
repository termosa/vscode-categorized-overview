import * as vscode from "vscode";
import list, { Module } from "./list";

const getModulesList = (onListSearch: (list: Module[]) => void) => {
  // TODO: If multiple workspaces — add them as category to modules
  const firstWorkspaceFolder = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0]
    : null;

  if (!firstWorkspaceFolder) {
    vscode.window.showErrorMessage("No workspace folder found");
    return;
  }

  const includedFolders: Array<string> =
    vscode.workspace.getConfiguration("categorizedOverview").get("includes") ||
    [];

  const rootPath = firstWorkspaceFolder.uri.path;
  return list(rootPath, includedFolders, onListSearch);
};

export default getModulesList;
