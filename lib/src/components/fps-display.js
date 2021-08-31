import * as React from 'react';
const { max } = Math;
export default class FpsDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            saveTime: Date.now(),
            frameCounterArray: [],
            fpsRate: 0,
        };
        FpsDisplay.frameCounter = 0;
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const { width } = nextProps;
        const { saveTime, frameCounterArray } = prevState;
        if ((Date.now() - saveTime) >= 1000) {
            frameCounterArray.push(FpsDisplay.frameCounter);
            if (frameCounterArray.length > (width / 2)) {
                frameCounterArray.shift();
            }
            const retuenObject = {
                saveTime: Date.now(),
                frameCounterArray: frameCounterArray,
                fpsRate: FpsDisplay.frameCounter,
            };
            FpsDisplay.frameCounter = 1;
            return retuenObject;
        }
        FpsDisplay.frameCounter = FpsDisplay.frameCounter + 1;
        return null;
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state !== prevState) {
            const { width, height, colorCode } = prevProps;
            const { frameCounterArray } = prevState;
            const context = this.canvas.getContext('2d');
            const maxValue = max.apply(null, frameCounterArray);
            context.clearRect(0, 0, width, height);
            frameCounterArray.forEach((frameCounter, idx) => {
                const value = (frameCounter / maxValue) * height;
                context.fillStyle = colorCode;
                context.fillRect((idx << 1), (height - value), 1, value);
            });
        }
    }
    render() {
        const { width, height, className, UnitCaption } = this.props;
        return (React.createElement("div", { className: className, title: `${this.state.fpsRate} ${UnitCaption}` },
            React.createElement("div", null,
                React.createElement("span", null, this.state.fpsRate),
                React.createElement("span", null, UnitCaption)),
            React.createElement("canvas", { ref: (canvas) => { this.canvas = canvas; }, width: width, height: height })));
    }
}
FpsDisplay.defaultProps = {
    width: 60,
    height: 40,
    colorCode: '#00FF00',
    className: 'harmovis_fpsRate',
    UnitCaption: 'fps'
};
//# sourceMappingURL=fps-display.js.map