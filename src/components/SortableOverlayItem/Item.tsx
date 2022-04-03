import React, { forwardRef } from "react";

export default forwardRef(({ children, ...props }: any, ref) => {
  return (
    <section {...props} ref={ref}>
      {children}
    </section>
  );
});
