import * as React from 'react';
import { RingLoader } from 'react-spinners';

interface Props {
  loading?: boolean,
  color?: string
}

const LoadingIcon = (props:Props)=>{
  const { loading, color } = props;
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
LoadingIcon.defaultProps = {
  loading: false,
  color: 'white'
}
export default LoadingIcon
