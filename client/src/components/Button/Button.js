import React from 'react';

const button = (props) => {
  const classes = ['btn'];
  if (typeof props !== 'undefined' && typeof props.type !== 'undefined') {
    classes.push('btn--' + props.type);
  }

  if (typeof props !== 'undefined' && typeof props.isMemoryFree !== 'undefined') {
    const memoryState = props.isMemoryFree ? 'memoryIsFree' : 'memoryOccupied'
    classes.push('btn--' + memoryState);
  }



  return (
    <button className={classes.join(' ')} onClick={props.onButtonPress}>
      {props.children}
    </button>
  );
}

export default button;