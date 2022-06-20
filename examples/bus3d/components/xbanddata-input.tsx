import * as React from 'react';
import { Bus3dActionsInterface } from '../types';

interface Props {
  actions: Bus3dActionsInterface,
  t: (key: string) => string,
}

const XbandDataInput = ({ actions, t }:Props)=>{
  const [filename,setFilename] = React.useState<string>('')

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const reader = new FileReader()
    const file = e.target.files[0]
    if (!file) {
      return
    }
    actions.setLoading(true)
    reader.readAsText(file)
    reader.onload = () => {
      let readdata = null
      try {
        readdata = JSON.parse(reader.result.toString())
      } catch (exception) {
        actions.setLoading(false)
        window.alert(exception)
        return
      }
      if (readdata.length > 0) {
        const { position, elevation, color } = readdata[0]
        if (position && (elevation || color)) {
          actions.setRainfall(readdata)
          setFilename(file.name)
          actions.setLoading(false)
          return
        }
        actions.setLoading(false)
        window.alert('雨量データ形式不正')
      }
      actions.setRainfall([])
      setFilename('選択されていません')
      actions.setLoading(false)
    }
  }

  return (
    <div className="harmovis_input_button_column">
      <label htmlFor="XbandDataInput" title={`${t('XbandDataInput')}`}>{t('XbandDataInput')}
        <input type="file" accept=".json" onChange={onSelect} id="XbandDataInput" />
      </label>
      <div>{filename}</div>
    </div>
  )
}
export default XbandDataInput
