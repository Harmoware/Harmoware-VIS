const FreeStyle = require('free-style');

const Style = FreeStyle.create();

export const ButtonClass = Style.registerStyle({
  backgroundColor: '#6A7485',
  borderRadius: '2px',
  color: '#FFFFFF',
  cursor: 'pointer',
  fontSize: '11px',
  fontWeight: '500',
  letterSpacing: '0.3px',
  lineHeight: '14px',
  padding: '3px 12px',
  textAlign: 'center',
  transition: 'all .4s ease',
  verticalAlign: 'middle',
  width: '105px'
});

export default Style.getStyles();
