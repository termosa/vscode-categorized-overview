import create from "./create";
import listenVscodeMessages from "./listenVscodeMessages";
import renderOutputList from "./renderOutputList";
import useModules from "./useModules";

const App = () => {
  const modulesState = useModules();

  const output = create("output");
  const input = create("input", {
    placeholder: "Filter by categories using @",
    oninput: (event: Event) => {
      return renderOutputList(
        output,
        modulesState.get(),
        event.target as HTMLInputElement
      );
    },
    className: "search",
  }) as HTMLInputElement;

  listenVscodeMessages((newModules) => {
    modulesState.set(newModules);
    input.value = "";
    renderOutputList(output, modulesState.get());
  });

  return create("div", {}, [input, output]);
};

document.body.appendChild(App());
