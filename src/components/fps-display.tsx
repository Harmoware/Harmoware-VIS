import * as React from 'react';

interface Props {
  width?: number,
  height?: number,
  colorCode?: string,
  className?: string,
  UnitCaption?: string,
}

interface State {
  saveTime: number,
  frameCounterArray: number[],
  fpsRate: number,
}

export default class FpsDisplay extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      saveTime: Date.now(),
      frameCounterArray: [],
      fpsRate: 0,
    };
    FpsDisplay.frameCounter = 0;
  }

  canvas: HTMLCanvasElement;
  static frameCounter: number;

  static defaultProps = {
      width: 60,
      height: 40,
      colorCode: '#00FF00',
      className: 'harmovis_fpsRate',
      UnitCaption: 'fps'
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State){
    const { width } = nextProps;
    const { saveTime, frameCounterArray } = prevState;
    if((Date.now() - saveTime) >= 1000){
      frameCounterArray.push(FpsDisplay.frameCounter);
      if(frameCounterArray.length > (width / 2)){
        frameCounterArray.shift();
      }
      const retuenObject = {
        saveTime: Date.now(),
        frameCounterArray: frameCounterArray,
        fpsRate: FpsDisplay.frameCounter,
      }
      FpsDisplay.frameCounter = 1;
      return retuenObject;
    }
    FpsDisplay.frameCounter = FpsDisplay.frameCounter + 1;
    return null;
  }

  componentDidUpdate(prevProps: Props, prevState: State){
    if(this.state !== prevState){
      const { width, height, colorCode } = prevProps;
      const { frameCounterArray } = prevState;
      const context = this.canvas.getContext('2d');
      const maxValue = Math.max.apply(null, frameCounterArray);
      context.clearRect(0,0,width,height);
      frameCounterArray.forEach((frameCounter, idx)=>{
        const value = (frameCounter / maxValue) * height;
        context.fillStyle = colorCode;
        context.fillRect((idx*2), (height-value), 1, value);
      });
    }
  }

  render() {
    const { width, height, className, UnitCaption } = this.props;

    return (
      <div className={className} title={`${this.state.fpsRate} ${UnitCaption}`}>
        <div><span>{this.state.fpsRate}</span><span>{UnitCaption}</span></div>
        <canvas
          ref={(canvas) => { this.canvas = canvas; }}
          width={width} height={height}
        />
      </div>
    );
  }
}
