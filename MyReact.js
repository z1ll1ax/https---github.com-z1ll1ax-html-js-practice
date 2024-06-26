export const MyReact = {
  createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        children,
      },
    };
  },
  render(element, container) {
    const dom = document.createElement(element.type);
    const isProperty = (key) => key !== "children";
    Object.keys(element.props)
      .filter(isProperty)
      .forEach((name) => {
        dom[name] = element.props[name];
      });
    element.props.children.forEach((child) => MyReact.render(child, dom));
    container.appendChild(dom);
  },
  updateProps(element, ...newProps) {
    return {
      type: element.type,
      props: {
        ...newProps,
        children: element.props.children,
      },
    };
  },
  appendChildren(element, ...newChildren) {
    const updatedChildren = element.props.children.concat(newChildren);
    return {
      type: element.type,
      props: {
        ...element.props,
        children: updatedChildren,
      },
    };
  },
};
