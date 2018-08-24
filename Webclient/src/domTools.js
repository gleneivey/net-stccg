
const domTools = {
  fixupListHeight: function (component) {
    if (!component.containerEl) { return; }
    component.containerEl.style.height = (window.innerHeight - component.containerEl.offsetTop) + "px";
  }
};

export default domTools;
