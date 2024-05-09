import { useState } from 'react'
import './App.css'
import PhoneInput from './PhoneInput/PhoneInput'

function App() {
  const [phone, setPhone] = useState('')
  const [regionCode, setRegionCode] = useState<string>()


  return (
    <div>
      <PhoneInput value={phone} onChange={setPhone} regionCode={regionCode} onChangeRegionCode={setRegionCode} />
      <button onClick={() => {
        setPhone('+5511984565666')
        setRegionCode('BR')
      }}>Set phone number programatically</button>
    </div>
  )
}

export default App
