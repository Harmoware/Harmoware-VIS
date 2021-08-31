import * as React from 'react';
export default class Container extends React.Component {
    constructor(props) {
        super(props);
        this.animationFrame = window.requestAnimationFrame(this.animate.bind(this));
    }
    componentDidMount() {
        window.addEventListener('resize', this.resize.bind(this));
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
        this.animationFrame = window.requestAnimationFrame(this.animate.bind(this));
    }
    resize() {
        this.props.actions.setViewport({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }
}
//# sourceMappingURL=index.js.map