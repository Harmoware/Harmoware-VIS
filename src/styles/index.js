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

export const controllerClass = Style.registerStyle({
  color: '#FFF',
  fontSize: '10pt',
  zIndex: 100,
  position: 'fixed',
  top: '10px',
  right: '20px',
  ul: {
    listStyleType: 'none',
    padding: '0px',
    margin: '0px'
  },
  li: {
    padding: '5px',
    display: 'flex'
  },
  span: {
    padding: '5px',
    display: 'flex'
  },
  input: {
    fontSize: '10pt'
  }
});

export const footerClass = Style.registerStyle({
  fontSize: '8pt',
  zIndex: 105,
  position: 'fixed',
  bottom: '8px',
  left: '10px',
  span: {
    padding: '5px'
  }
});

export const headerClass = Style.registerStyle({
  fontSize: '12pt',
  zIndex: 110,
  position: 'fixed',
  top: '10px',
  left: '20px',
  input: {
    fontSize: '10pt'
  },
  span: {
    padding: '10px'
  }
});

export default Style.getStyles();
