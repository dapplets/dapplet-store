const simulateOnMouseHover = (el: HTMLButtonElement | null) => {
  if (el === null) return;
  const mouseOverEvent = new window.MouseEvent("mouseover", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  const mouseLeaveEvent = new window.MouseEvent("mouseleave", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  el.dispatchEvent(mouseLeaveEvent);
  el.dispatchEvent(mouseOverEvent);
};

export default simulateOnMouseHover;
