import * as React from 'react';

interface Props {
  width?: number,
  height?: number,
  colorCode?: string,
  className?: string,
  UnitCaption?: string,
}

const FpsDisplay = (props:Props)=>{
  const { width, height, className, UnitCaption, colorCode } = props;
  const canvas = React.useRef(undefined);
  const [context,setContext] = React.useState(undefined)
  const [saveTime,setSaveTime] = React.useState(Date.now() as number)
  const [frameCounterArray,setFrameCounterArray] = React.useState([] as number[])
  const [fpsRate,setFpsRate] = React.useState(0 as number)

  if((Date.now() - saveTime) >= 1000){
    frameCounterArray.push(FpsDisplay.frameCounter);
    if(frameCounterArray.length > (width / 2)){
      frameCounterArray.shift();
    }
    setSaveTime(Date.now())
    setFrameCounterArray(frameCounterArray)
    setFpsRate(FpsDisplay.frameCounter)
    FpsDisplay.frameCounter = 1;
  }else{
    FpsDisplay.frameCounter = FpsDisplay.frameCounter + 1;
  }

  React.useEffect(()=>{
    if(canvas !== undefined){
      const context = canvas.current.getContext('2d');
      setContext(context)
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
