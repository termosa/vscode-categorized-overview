"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fuzzysort_1 = __importDefault(require("fuzzysort"));
const vscodeApi = acquireVsCodeApi();
const log = (text, type = "info") => {
    if (vscodeApi) {
        vscodeApi.postMessage({
            command: "showMessage",
            type,
            text: JSON.stringify(text),
        });
        return;
    }
    console.log(text);
};
const useModules = () => {
    let modules;
    return {
        set: (newModules) => {
            modules = newModules;
        },
        get: () => modules,
    };
};
const modulesState = useModules();
const listenMessageChange = (onChange) => {
    window.addEventListener("message", (event) => {
        try {
            onChange(JSON.parse(event.data));
        }
        catch (err) {
            log(err, "error");
        }
    });
};
const create = (name = "div", props = {}, children = []) => children.reduce((el, child) => {
    el.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    return el;
}, Object.assign(document.createElement(name), props));
const getSortedItems = (search) => {
    return fuzzysort_1.default.go(search ?? "", modulesState.get(), {
        all: true,
        key: "name",
    });
};
const openFile = (path) => {
    vscodeApi.postMessage({
        command: "openFile",
        text: path,
    });
};
const renderModulesList = (output, search) => {
    const results = getSortedItems(search);
    Array.from(output.children).forEach((c) => c.remove());
    const list = create("ul", { className: "list" }, results.map((result) => {
        const liContent = result.score === -Infinity
            ? result.target
            : fuzzysort_1.default.highlight(result) ?? result.target;
        const li = create("li", {
            onclick: () => openFile(result.obj.path),
        }, []);
        li.innerHTML = liContent;
        return li;
    }));
    output.appendChild(list);
};
const App = () => {
    const output = create("output");
    const input = create("input", {
        placeholder: "Filter by categories using @",
        oninput: (event) => renderModulesList(output, event.target.value),
        className: "search",
    });
    listenMessageChange((newModules) => {
        modulesState.set(newModules);
        renderModulesList(output);
    });
    return create("div", {}, [input, output]);
};
document.body.appendChild(App());
//# sourceMappingURL=main.js.map