import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Clarifai from 'clarifai';
import './App.css';

const app = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI_API_KEY
 });

const particlesOptions = {
  "particles": {
    "number": {
        "value": 250
    },
    "size": {
        "value": 3
    }
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'home',
      isSignedIn: false,
      boxes: [],
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
      } 
    }
  }

  loadUser = (userdata) => {
    this.setState({user: {
      id: userdata.id,
      name: userdata.name,
      email: userdata.email,
      entries: userdata.entries,
      joined: userdata.joined,
    }});
  }

  
  // calculateFaceLocation = (data) => {


  //   var clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
  //   const image = document.getElementById('inputImage');
  //   const width = Number(image.width);
  //   const height = Number(image.height);

  //   return {
  //     leftCol: clarifaiFace.left_col * width,
  //     topRow: clarifaiFace.top_row * height,
  //     rightCol: width - (clarifaiFace.right_col * width),
  //     bottomRow: height - (clarifaiFace.bottom_row * height)
  //   }

    

  // }
  // =======================================================================================
  calculateFaces = (d) => {

    let data = JSON.parse(d)

    console.log(data)

    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    var boxes = []


    for(var i=0; i<data.outputs[0].data.regions.length; i++){
      // console.log(data.outputs[0].data.regions[i].region_info.bounding_box)
      var Face = data.outputs[0].data.regions[i].region_info.bounding_box;
      var box = {
        leftCol: Face.left_col * width,
        topRow: Face.top_row * height,
        rightCol: width - (Face.right_col * width),
        bottomRow: height - (Face.bottom_row * height)
      }
      boxes.push(box);
    }
    return boxes; 
  }

  displayFaceBox = (boxes) => {
    this.setState({boxes: boxes})
  }


// ===========================================================================================

  // displayFaceBox = (box) => {
  //   this.setState({box: box})
  // }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  

// NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
// https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
// this will default to the latest version_id




onSubmit = () => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + process.env.REACT_APP_CLARIFAI_AUTH_KEY
        },
        body: JSON.stringify({
          "user_app_id": {
            "user_id": "clarifai",
            "app_id": "main"
          },
          "inputs": [
              {
                  "data": {
                      "image": {
                          "url": this.state.input
                      }
                  }
              }
          ]
        })
    };
    this.setState({ imageUrl: this.state.input});
    fetch(`https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`, requestOptions)
    .then(response => response.text())
    .then(response => {
      this.displayFaceBox(this.calculateFaces(response))
    })
    .catch(error => console.log('error', error));
    // app.models
    // .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    // .then(response => {
    //   console.log(response)
    //   if(response){
    //     fetch('http://localhost:3000/image',{
    //       method: 'PUT',
    //       headers: {'Content-Type': 'application/json'},
    //       body: JSON.stringify({
    //         id: this.state.user.id
    //       })
    //     })
    //     .then(res => res.json())
    //     .then(count => {
    //       this.setState(Object.assign(this.state.user, {entries: count}))
    //     })
    //   }
    // this.displayFaceBox(this.calculateFaces(response))
    // })
    // .catch(err => console.log(err));
  }
  // response.outputs[0].data.regions[0].region_info.bounding_box

  onRouteChange = (route) => {
    if(route === 'signout') {  
      this.setState({isSignedIn: false});
    } else if (route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route})
  }





  render() {
    return (
    <div className="App pt5">
      <Particles className='particles'
      params={particlesOptions} />
      {/* <Navigation isSignedIn = {this.state.isSignedIn} onRouteChange = {this.onRouteChange} /> */}
      { this.state.route === 'home'
      ? <div>
          <Logo />
          {/* <Rank name={ this.state.user.name } entries={ this.state.user.entries } /> */}
          <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit = { this.onSubmit } />
          <FaceRecognition box={this.state.box} boxes={this.state.boxes} imageUrl={this.state.imageUrl} />
        </div>  
      : (
        this.state.route === 'signin'
        ? <SignIn loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} />
        : <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} />
      )
      }
    </div>
  );
  }
}

export default App;
