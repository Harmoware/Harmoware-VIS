import * as React from 'react'
import { Bus3dDepotsData } from '../types'

interface Props {
  selectedBusstop: string,
  date: number,
  depotsData: Bus3dDepotsData[]
}

const BusStopInfo = ({ selectedBusstop, date, depotsData }:Props)=>{
  const d = React.useMemo(()=>new Date(date),[date])
  const width = React.useMemo(
    ()=>selectedBusstop.length > 0 && selectedBusstop !== '0000' ? '100%' : '0%',
    [selectedBusstop])
  const height = React.useMemo(
    ()=>selectedBusstop.length > 0 && selectedBusstop !== '0000' ? '100%' : '0%',
    [selectedBusstop])
  const busstop = React.useMemo(
    ()=>depotsData.find((busstopElement) => busstopElement.code === selectedBusstop),
    [selectedBusstop,depotsData])
  return (<svg width={width} height={height}>
    {selectedBusstop.length > 0 && selectedBusstop !== '0000' ?
      <rect width={width} height={height} stroke="none" fill="none" /> : null}
    {selectedBusstop.length > 0 && selectedBusstop !== '0000' ?
      <text x="20" y="20" fill="white">{`${d.toLocaleDateString()} ${d.toLocaleTimeString()}`}</text> : null}
    {selectedBusstop.length > 0 && selectedBusstop !== '0000' ?
      <text x="20" y="40" fill="white">{selectedBusstop}:{busstop.name}</text> : null}
    {selectedBusstop.length > 0 && selectedBusstop !== '0000' ?
      <text x="20" y="60" fill="white">{busstop.memo}</text> : null}
  </svg>)
}
export default BusStopInfo
