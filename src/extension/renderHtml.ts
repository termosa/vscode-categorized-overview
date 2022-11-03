import * as path from "path";
import * as fs from "fs";
import * as vscode from "vscode";
import getUri from "./get-uri";

function normalizePathAttributes(
  html: string,
  urlBuilder: (path: string) => string
): string {
  const matched = html.match(/\s(src|href)="[^"]+"/gm);
  if (!matched?.length) return html;
  return matched.reduce((text, matched) => {
    const valueIndex = matched.indexOf('"') + 1;
    const property = matched.slice(1, valueIndex - 2);
    const value = matched.slice(valueIndex, -1);
    return text.replace(matched, ` ${property}="${urlBuilder(value)}"`);
  }, html);
}

export default function renderHtml(
  webviewView: vscode.WebviewView,
  extensionUri: vscode.Uri
) {
  const file = fs.readFileSync(
    path.join(__dirname, "ui", "index.html"),
    "utf-8"
  );

  const normalizePath = (path: string) =>
    getUri(webviewView.webview, extensionUri, ["out", "ui", path]).toString();

  webviewView.webview.html = normalizePathAttributes(file, normalizePath);
}
