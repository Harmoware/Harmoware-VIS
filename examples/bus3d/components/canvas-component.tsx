import * as React from 'react';

interface Props {
  width: number,
  height: number,
  updateCanvas: (context: CanvasRenderingContext2D) => void,
}

const CanvasComponent = (props:Props)=>{
  const canvas = React.useRef(undefined);

  React.useEffect(()=>{
    if(canvas !== undefined){
      const context = canvas.current.getContext('2d');
      props.updateCanvas(context);
    }
  },[canvas])

  return (<canvas
    ref={canvas} width={props.width} height={props.height}
  />);
}
export default CanvasComponent
