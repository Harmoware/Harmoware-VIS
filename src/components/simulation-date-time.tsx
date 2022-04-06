import * as React from 'react';

interface Props {
  settime: number,
  caption?: string,
  locales?: string,
  options?: object,
  className?: string
}

const SimulationDateTime = (props:Props)=>{
  const { settime, caption, locales, options, className } = props;
  const date = new Date(settime * 1000);
  const nbsp = caption.length > 0 ? ' ' : '';

  return (
    <span className={className}
      title={`${caption}${nbsp}${date.toLocaleString(locales, options)}`}>
      {caption}{nbsp}
      {date.toLocaleString(locales, options)}
    </span>
  )
}
SimulationDateTime.defaultProps = {
  caption: '',
  locales: 'ja-JP',
  options: { year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short' },
}
export default SimulationDateTime
