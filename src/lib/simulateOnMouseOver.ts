const simulateOnMouseOver = (el: HTMLButtonElement | null) => {
  if (el === null) return;
  el.dispatchEvent(
    new window.MouseEvent("mouseover", {
      view: window,
      bubbles: true,
      cancelable: true,
    }),
  );
};

export default simulateOnMouseOver;
