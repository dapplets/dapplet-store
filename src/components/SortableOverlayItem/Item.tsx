import React, {forwardRef} from 'react';

export default forwardRef(({children, ...props}: any, ref) => {
  return <div {...props} ref={ref}>{children}</div>;
});