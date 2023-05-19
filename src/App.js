import React, { useState } from 'react'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import ParticlesBg from 'particles-bg'
import './App.css'

function App() {
  const [input, setInput] = useState(
    'https://samples.clarifai.com/metro-north.jpg'
  )
  const [imageUrl, setImageUrl] = useState('')

  const onInputChange = (e) => {
    setInput(e.target.value)
  }

  const onButtonSubmit = () => {
    setImageUrl(input)
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = 'afc12b6105524d72ab52eb621ff5fbf2'
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'clarifai'
    const APP_ID = 'main'
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection'
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105'
    const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg'

    ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: input,
            },
          },
        },
      ],
    })

    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Key ' + PAT,
      },
      body: raw,
    }

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    fetch(
      'https://api.clarifai.com/v2/models/' +
        MODEL_ID +
        '/versions/' +
        MODEL_VERSION_ID +
        '/outputs',
      requestOptions
    )
      .then((response) => response.json())
      .then((result) =>
        console.log(result.outputs[0].data.regions[0].region_info.bounding_box)
      )
      .catch((error) => console.log('error', error))
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
      <FaceRecognition imageUrl={imageUrl} />
    </div>
  )
}

export default App
