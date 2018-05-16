import React, { Component } from 'react';

export default class BusStopInfo extends Component {
  render() {
    const { selectedBusstop, date, depotsData } = this.props;
    const d = new Date(date);
    const width = selectedBusstop.length > 0 && selectedBusstop !== '0000' ? '300px' : '0px';
    const height = selectedBusstop.length > 0 && selectedBusstop !== '0000' ? '100px' : '0px';
    const busstop = depotsData.find((busstopElement) => {
      if (busstopElement.code === selectedBusstop) {
        return true;
      }
      return false;
    });
    return (<svg width={width} height={height}>
      {selectedBusstop.length > 0 && selectedBusstop !== '0000' ?
        <rect width={width} height={height} stroke="none" fill="none" /> : null}
      {selectedBusstop.length > 0 && selectedBusstop !== '0000' ?
        <text x="20" y="20" fill="white">{`${d.toLocaleDateString()} ${d.toLocaleTimeString()}`}</text> : null}
      {selectedBusstop.length > 0 && selectedBusstop !== '0000' ?
        <text x="20" y="40" fill="white">{selectedBusstop}:{busstop.name}</text> : null}
      {selectedBusstop.length > 0 && selectedBusstop !== '0000' ?
        <text x="20" y="60" fill="white">{busstop.memo}</text> : null}
    </svg>);
  }
}
