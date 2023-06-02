import React, { useState, useEffect } from 'react'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import ParticlesBg from 'particles-bg'
import './App.css'

function App() {
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  })
  const [imageUrl, setImageUrl] = useState('')
  const [box, setBox] = useState({})
  const [route, setRoute] = useState('')
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3005')
      .then((res) => res.json())
      .then(console.log)
  }, [])

  // Load User Info
  const loadUser = (data) => {
    setUser({
      ...user,
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    })
  }

  const calculateFaceLocation = (result) => {
    const clarifaiFace =
      result.outputs[0].data.regions[0].region_info.bounding_box
    // console.log(clarifaiFace)
    const image = document.getElementById('inputImage')
    const width = Number(image.width)
    const height = Number(image.height)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    }
  }

  const displayFaceBox = (box) => {
    setBox(box)
  }

  const onInputChange = (e) => {
    setImageUrl(e.target.value)
  }

  const onPictureSubmit = () => {
    if (imageUrl) {
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
                url: imageUrl,
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
        .then((result) => {
          if (result) {
            fetch('http://localhost:3005/image', {
              method: 'put',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: user.id,
              }),
            })
              .then((response) => response.json())
              .then((count) => {
                setUser({ ...user, entries: count })
              })
          }
          displayFaceBox(calculateFaceLocation(result))
        })
        .catch((error) => console.log('error', error))
    }
  }

  const onRouteChange = (route) => {
    let signInStatus = false
    if (route === 'signout') {
      signInStatus = false
    } else if (route === 'home') {
      signInStatus = true
    }
    setRoute(route)
    setIsSignedIn(signInStatus)
  }

  return (
    <div className="App">
      <ParticlesBg type="cobweb" bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === 'home' ? (
        <>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onPictureSubmit={onPictureSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </>
      ) : route === 'signin' ? (
        <SignIn onRouteChange={onRouteChange} loadUser={loadUser} />
      ) : (
        <Register onRouteChange={onRouteChange} loadUser={loadUser} />
      )}
    </div>
  )
}

export default App
