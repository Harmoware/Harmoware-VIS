import * as React from 'react';
class Container extends React.Component {
    constructor(props) {
        super(props);
        this.animate = this.animate.bind(this);
        this.resize = this.resize.bind(this);
        this.animationFrame = window.requestAnimationFrame(this.animate);
    }
    componentDidMount() {
        window.addEventListener('resize', this.resize);
        this.resize();
    }
    componentWillUnmount() {
        if (this.animationFrame) {
            window.cancelAnimationFrame(this.animationFrame);
        }
    }
    animate() {
        if (this.props.timeLength > 0) {
            if (!this.props.animatePause && !this.props.loopEndPause) {
                if (!this.props.animateReverse) {
                    this.props.actions.increaseTime(this.props);
                }
                else {
                    this.props.actions.decreaseTime(this.props);
                }
            }
            else {
                this.props.actions.setFrameTimestamp(this.props);
            }
        }
        else {
            this.props.actions.setTimeStamp(this.props);
        }
        this.animationFrame = window.requestAnimationFrame(this.animate);
    }
    resize() {
        this.props.actions.setViewport({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }
    render() {
        return (React.createElement(React.Fragment, null, this.props.children));
    }
}
export default Container;
//# sourceMappingURL=index.js.map