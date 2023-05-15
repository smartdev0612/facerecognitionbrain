import React, { useState } from 'react'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import ParticlesBg from 'particles-bg'
import './App.css'

function App() {
  const [input, setInput] = useState('')

  const onInputChange = (e) => {
    console.log(e.target.value)
  }

  const onButtonSubmit = () => {
    console.log('click')
  }

  return (
    <div className="App">
      <ParticlesBg type="cobweb" bg={true} />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm
        onInputChange={onInputChange}
        onButtonSubmit={onButtonSubmit}
      />
      {/*<FaceRecognition /> */}
    </div>
  )
}

export default App
