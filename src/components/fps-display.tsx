import * as React from 'react';

interface Props {
  width?: number,
  height?: number,
  colorCode?: string,
  className?: string,
  UnitCaption?: string,
}
interface State {
  context: any,
  saveTime: number,
  frameCounterArray: number[],
  fpsRate: number,
}
const initState:State = {
  context: undefined,
  saveTime: Date.now(),
  frameCounterArray: [],
  fpsRate: 0,
}

const FpsDisplay = (props:Props)=>{
  const { width, height, className, UnitCaption, colorCode } = props;
  const canvas = React.useRef(undefined);
  const [state,setState] = React.useState<State>(initState)
  const { context, saveTime, frameCounterArray, fpsRate } = state

  if((Date.now() - saveTime) >= 1000){
    frameCounterArray.push(FpsDisplay.frameCounter);
    if(frameCounterArray.length > (width / 2)){
      frameCounterArray.shift();
    }
    setState({...state,
      saveTime:Date.now(), frameCounterArray, fpsRate:FpsDisplay.frameCounter})
    FpsDisplay.frameCounter = 1;
  }else{
    FpsDisplay.frameCounter = FpsDisplay.frameCounter + 1;
  }

  React.useEffect(()=>{
    if(canvas.current !== undefined){
      const context = canvas.current.getContext('2d');
      setState({...state, context})
    }
  },[canvas])

  React.useEffect(()=>{
    if(context !== undefined){
      const maxValue = Math.max.apply(null, frameCounterArray);
      context.clearRect(0,0,width,height);
      frameCounterArray.forEach((frameCounter, idx)=>{
        const value = (frameCounter / maxValue) * height;
        context.fillStyle = colorCode;
        context.fillRect((idx<<1), (height-value), 1, value);
      });
    }
  },[saveTime])

  return (
    <div className={className} title={`${fpsRate} ${UnitCaption}`}>
      <div><span>{fpsRate}</span><span>{UnitCaption}</span></div>
      <canvas ref={canvas} width={width} height={height} />
    </div>
  );
}
FpsDisplay.defaultProps = {
  width: 60,
  height: 40,
  colorCode: '#00FF00',
  className: 'harmovis_fpsRate',
  UnitCaption: 'fps'
}
FpsDisplay.frameCounter = 0 as number
export default FpsDisplay
