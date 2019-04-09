import * as React from 'react';

interface Props {
  width?: number,
  height?: number,
  colorCode?: string,
  className?: string,
  UnitCaption?: string,
}

interface State {
  fpsRate: number,
}

export default class FpsDisplay extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.saveTime = Date.now();
    this.frameCounter = 0;
    this.frameCounterArray = [];
    this.animationFrame = window.requestAnimationFrame(this.animate.bind(this));
    this.state = {
      fpsRate: 0,
    };
  }

  animationFrame: number;
  saveTime: number;
  frameCounter: number;
  frameCounterArray: number[];
  canvas: HTMLCanvasElement;

  static defaultProps = {
      width: 60,
      height: 40,
      colorCode: '#00FF00',
      className: 'harmovis_fpsRate',
      UnitCaption: 'fps'
  }

  componentWillUnmount() {
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
    }
  }

  updateCanvas(frameCounter: number) {
    const { width, height, colorCode } = this.props;
    const { frameCounterArray, canvas } = this;
    frameCounterArray.push(frameCounter);
    if(frameCounterArray.length > (width / 2)){
      frameCounterArray.shift();
    }
    const maxValue = Math.max.apply(null, frameCounterArray);
    const context = canvas.getContext('2d');
    context.clearRect(0,0,width,height);
    frameCounterArray.forEach((frameCounter, idx)=>{
      const value = (frameCounter / maxValue) * height;
      context.fillStyle = colorCode;
      context.fillRect((idx*2), (height-value), 1, value);
    });
  }

  animate() {
    if((Date.now() - this.saveTime) >= 1000){
      this.setState({ fpsRate: this.frameCounter });
      this.saveTime = Date.now();
      this.updateCanvas(this.frameCounter);
      this.frameCounter = 0;
    }
    this.frameCounter += 1;

    this.animationFrame = window.requestAnimationFrame(this.animate.bind(this));
  }

  render() {
    const { width, height, className, UnitCaption } = this.props;

    return (
      <div className={className}>
        <div><span>{this.state.fpsRate}</span><span>{UnitCaption}</span></div>
        <canvas
          ref={(canvas) => { this.canvas = canvas; }}
          width={width} height={height}
        />
      </div>
    );
  }
}
