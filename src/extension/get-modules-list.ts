import * as path from "path";
import * as vscode from "vscode";
import list, { Module } from "./list";
import matchOverviewFiles from "./match-overview-files";

const getModulesList = async (onListSearch: (list: Module[]) => void) => {
  const overviewFoldersInFs = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders
        .filter((folder) => folder.uri.scheme === "file")
        .map((folder) => folder.uri.path)
    : null;
  if (!overviewFoldersInFs) return;

  // TODO: Remove matchOverviewFiles() and use workspaces (all) instead
  // TODO: If multiple workspaces — add them as category to modules
  // TODO: Using VSCode API need to add .vscode/settings.json option to configure glob() parameters
  const configs = await matchOverviewFiles(overviewFoldersInFs);

  if (!configs.length) return;

  const configPath = configs[0];
  const sourceDir = path.parse(configPath).dir;

  const config = require(`${sourceDir}/.overview.json`);

  const rootPath = config.includes
    ? path.resolve(sourceDir, config.includes)
    : sourceDir;

  list(rootPath, onListSearch);
};

export default getModulesList;
