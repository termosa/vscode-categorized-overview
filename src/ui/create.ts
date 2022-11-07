const create = (name = "div", props = {}, children: Array<HTMLElement> = []) =>
  children.reduce((el, child) => {
    el.appendChild(
      typeof child === "string" ? document.createTextNode(child) : child
    );
    return el;
  }, Object.assign(document.createElement(name), props));

export default create;
