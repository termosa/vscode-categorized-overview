import log from "./log";
import { IModule } from "./useModules";

const listenVscodeMessages = (onChange: (modules: Array<IModule>) => void) => {
  window.addEventListener("message", (event) => {
    try {
      onChange(JSON.parse(event.data));
    } catch (err) {
      log(err, "error");
    }
  });
};

export default listenVscodeMessages;
