const simulateOnMouseOut = (el: HTMLButtonElement | null) => {
  if (el === null) return;
  el.dispatchEvent(
    new window.MouseEvent("mouseout", {
      view: window,
      bubbles: true,
      cancelable: true,
    }),
  );
};

export default simulateOnMouseOut;
