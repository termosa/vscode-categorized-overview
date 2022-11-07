import * as chokidar from "chokidar";
import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";

export interface Module {
  name: string;
  categories: Array<string>;
  path: string;
}

const parseModule = (relativePath: string, cwd: string): Module | null => {
  const filePath = path.join(cwd, relativePath);
  const content = fs.readFileSync(filePath, "utf-8");

  const isHaveExports = !!content.match(/^export\s/gm)?.length;
  if (!isHaveExports) return null;

  const [fileName, ...paths] = relativePath.split("/").reverse();

  const name =
    fileName.startsWith("index") && paths[0]
      ? `${paths[0]}.${fileName.split(".").slice(-1)}`
      : fileName;

  const categories = (content.match(/^\s*\*\s*@category\s.+$/gm) || []).concat(
    paths.map((path) => path.split("-")[0])
  );
  const formattedCategories = [
    ...new Set(
      categories?.map((cat) =>
        cat.replace("@category", "").replace("*", "").trim()
      )
    ),
  ];

  return {
    name: name,
    categories: formattedCategories,
    path: filePath,
  };
};

const parseIncludedFolders = (includedFolders: Array<string>) => {
  if (!includedFolders.length) {
    return "**/*";
  }

  if (includedFolders.length === 1) {
    return `${includedFolders}/**/*`;
  }

  return `{${includedFolders.join(",")}}/**/*`;
};

const readModules = (
  dirname: string,
  includedFolders: Array<string>,
  onRead: (modules: Array<Module>) => void,
  onError: (err: Error) => void
) => {
  const globString = parseIncludedFolders(includedFolders);
  glob(
    globString,
    {
      cwd: dirname,
      nodir: true,
      ignore: ["node_modules/**"],
    },
    (error, files) => {
      if (error) {
        onError(error);
        return;
      }

      const modules = files
        .filter((fileName) => /.((j|t)sx?|mjs)$/.test(fileName))
        .map((fileName) => parseModule(fileName, dirname))
        .filter(Boolean)
        .sort((a, b) =>
          ((a && a.name) || "").localeCompare((b && b.name) || "")
        );

      onRead(modules as Array<Module>);
    }
  );
};

const list = (
  dirname: string,
  includedFolders: Array<string>,
  callback: (modules: Array<Module>) => void
) => {
  readModules(dirname, includedFolders, callback, console.error);

  const process = chokidar.watch(dirname).on("change", () => {
    readModules(dirname, includedFolders, callback, console.error);
  });

  return process.close;
};

export default list;
