import create from "./create";
import listenVscodeMessages from "./listenVscodeMessages";
import renderModulesList from "./renderModulesList";
import useModules from "./useModules";

const App = () => {
  const modulesState = useModules();

  const output = create("output");
  const input = create("input", {
    placeholder: "Filter by categories using @",
    oninput: (event: Event) =>
      renderModulesList(
        output,
        modulesState.get(),
        (event.target as HTMLInputElement).value
      ),
    className: "search",
  });

  listenVscodeMessages((newModules) => {
    modulesState.set(newModules);
    renderModulesList(output, modulesState.get());
  });
  return create("div", {}, [input, output]);
};

document.body.appendChild(App());
