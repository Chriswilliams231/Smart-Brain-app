import React, { Component } from 'react';
// import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

import './App.css';
// import { count } from 'console';

// const app = new Clarifai.App({
//   apiKey: "20f8d819af4a40bf8b4c78573f567ca3"
// });

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    console.log("click")
    // app.models
    //   .predict(
    //     '53e1df302c079b3db8a0a36033ed2d15', this.state.input)
    //   .then(response => {
    //     if (response) {
    //       fetch('http://localhost:3000/image', {
    //         method: 'put',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //           id: this.state.user.id
    //         })
    //       })
    //         .then(response => response.json())
    //         .then(count => {
    //           this.setState(Object.assign(this.state.user, { entries: count }))
    //         })
    //     }
    //     this.displayFaceBox(this.calculateFaceLocation(response))
    //   })
    //   .catch(err => console.log(err))

  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false })
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route })
  }
  render() {
    const { isSignedIn, box, imageUrl, route } = this.state;
    return (
      <>
        <div className="App">
          <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
          {
            this.state.route === 'home' ?
              <>
                <Logo />
                <Rank name={this.state.user.name} entries={this.state.user.entries} />
                <ImageLinkForm onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit} />
                <FaceRecognition box={box} imageUrl={imageUrl} />
              </>

              : (
                route === 'signin'
                  ? < Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                  : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              )


          }
        </div>
      </>
    );
  }
}

export default App;
