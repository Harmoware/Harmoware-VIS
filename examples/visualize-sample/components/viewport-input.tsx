import * as React from 'react';
import { Viewport } from 'harmoware-vis';

interface Props {
  id?: string,
  className?: string,
  style?: React.CSSProperties,
  getViewport: (viewport:Viewport)=>{}
}

export default class ViewportInput extends React.Component<Props> {

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    reader.readAsText(file);
    reader.onload = () => {
      let readdata:Viewport = {};
      try {
        readdata = JSON.parse(reader.result.toString());
      } catch (exception) {
        window.alert(exception);
        return;
      }
      this.props.getViewport(readdata);
    };
  }

  onClick(e: React.ChangeEvent<HTMLInputElement>) {
    e.target.value = '';
  }

  render() {
    const { id, className, style } = this.props;

    return (
      <input type="file" accept=".json"
      id={id} className={className} style={style}
      onClick={this.onClick.bind(this)}
      onChange={this.onChange.bind(this)}
      />
    );
  }
}
