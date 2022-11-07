import log from "./log";
import { Module } from "./useModules";

const listenVscodeMessages = (onChange: (modules: Array<Module>) => void) => {
  window.addEventListener("message", (event) => {
    try {
      onChange(JSON.parse(event.data));
    } catch (err) {
      log(err, "error");
    }
  });
};

export default listenVscodeMessages;
