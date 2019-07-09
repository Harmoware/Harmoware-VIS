import * as React from 'react';
import { RingLoader } from 'react-spinners';

interface Props {
  loading?: boolean,
  color?: string
}

export default class LoadingIcon extends React.Component<Props> {
  static defaultProps = {
    loading: false,
    color: 'white'
  }

  render() {
    const { loading, color } = this.props;
    if (loading) {
      const devStyle = { position: 'fixed' as 'fixed', zIndex: 200, top: 0, left: 0, width: '100%', height: '100%', display: 'flex' };
      const iconStyle = { margin: 'auto', display: 'flex' };
      return (
        <div style={devStyle}>
          <div style={iconStyle}>
            <RingLoader size={60} color={color} loading={loading} />
          </div>
        </div>
      );
    }
    return null;
  }
}
