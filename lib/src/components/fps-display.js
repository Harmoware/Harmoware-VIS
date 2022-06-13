import * as React from 'react';
const FpsDisplay = (props) => {
    const { width, height, className, UnitCaption, colorCode } = props;
    const canvas = React.useRef(undefined);
    const [context, setContext] = React.useState(undefined);
    const [saveTime, setSaveTime] = React.useState(Date.now());
    const [frameCounterArray, setFrameCounterArray] = React.useState([]);
    const [fpsRate, setFpsRate] = React.useState(0);
    if ((Date.now() - saveTime) >= 1000) {
        frameCounterArray.push(FpsDisplay.frameCounter);
        if (frameCounterArray.length > (width / 2)) {
            frameCounterArray.shift();
        }
        setSaveTime(Date.now());
        setFrameCounterArray(frameCounterArray);
        setFpsRate(FpsDisplay.frameCounter);
        FpsDisplay.frameCounter = 1;
    }
    else {
        FpsDisplay.frameCounter = FpsDisplay.frameCounter + 1;
    }
    React.useEffect(() => {
        if (canvas.current !== undefined) {
            const context = canvas.current.getContext('2d');
            setContext(context);
        }
    }, [canvas]);
    React.useEffect(() => {
        if (context !== undefined) {
            const maxValue = Math.max.apply(null, frameCounterArray);
            context.clearRect(0, 0, width, height);
            frameCounterArray.forEach((frameCounter, idx) => {
                const value = (frameCounter / maxValue) * height;
                context.fillStyle = colorCode;
                context.fillRect((idx << 1), (height - value), 1, value);
            });
        }
    }, [saveTime]);
    return (React.createElement("div", { className: className, title: `${fpsRate} ${UnitCaption}` },
        React.createElement("div", null,
            React.createElement("span", null, fpsRate),
            React.createElement("span", null, UnitCaption)),
        React.createElement("canvas", { ref: canvas, width: width, height: height })));
};
FpsDisplay.defaultProps = {
    width: 60,
    height: 40,
    colorCode: '#00FF00',
    className: 'harmovis_fpsRate',
    UnitCaption: 'fps'
};
FpsDisplay.frameCounter = 0;
export default FpsDisplay;
//# sourceMappingURL=fps-display.js.map