const create = (
  name = "div",
  props = {},
  children: Array<string | HTMLElement> = []
) =>
  children.reduce((el: HTMLElement, child) => {
    el.appendChild(
      typeof child === "string" ? document.createTextNode(child) : child
    );
    return el;
  }, Object.assign(document.createElement(name), props));

export default create;
