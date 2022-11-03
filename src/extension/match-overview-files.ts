import * as fs from "fs";
import * as path from "path";

const configFileName = ".overview.json";

export default async function matchOverviewFiles(folders: Array<string>) {
  return Promise.all(
    folders.map((folderPath) => {
      return new Promise((resolve: (value: Array<string>) => void) => {
        const guessPath = path.resolve(folderPath, configFileName);
        fs.exists(guessPath, (exists) => {
          if (exists) return resolve([guessPath]);
          fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
            if (err) return resolve([]);

            const subFolders = files
              .filter((dirent) => dirent.isDirectory())
              .map((dirent) => path.resolve(folderPath, dirent.name));
            if (!subFolders.length) return resolve([]);

            matchOverviewFiles(subFolders).then(resolve);
          });
        });
      });
    })
  ).then((results) => results.reduce((all, result) => all.concat(result), []));
};
