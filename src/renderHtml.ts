import * as path from "path";
import * as fs from "fs";
import * as vscode from "vscode";
import getUri from "./get-uri";

const renderHtml = (
  webviewView: vscode.WebviewView,
  extensionUri: vscode.Uri
) => {
  const file = fs.readFileSync(
    path.join(__dirname, "view-front", "index.html"),
    "utf-8"
  );

  const scriptReg = file.match(/\/index\.[\d\w]+\.js/g);
  let script;
  if (scriptReg) {
    script = scriptReg[0];
  } else {
    throw new Error("Can't find script path");
  }

  const stylesReg = file.match(/\/index\.[\d\w]+\.css/g);
  let styles;
  if (stylesReg) {
    styles = stylesReg[0];
  } else {
    throw new Error("Can't find styles path");
  }

  const uriPath = getUri(webviewView.webview, extensionUri, [
    "out",
    "view-front",
  ]);

  const newFile = file
    .replace(script, path.join(uriPath.toString(), script))
    .replace(styles, path.join(uriPath.toString(), styles));

  webviewView.webview.html = newFile;
};

export default renderHtml;
