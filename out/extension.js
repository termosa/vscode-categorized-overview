"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const ViewProvider_1 = require("./ViewProvider");
function activate(context) {
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("library", new ViewProvider_1.default(context.extensionUri), { webviewOptions: { retainContextWhenHidden: true } }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map