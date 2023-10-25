import { Component } from "react";
import './App.css';
import ParticlesBg from "particles-bg";
import { Logo } from "./components/Logo/Logo";
import { Navigation } from "./components/Navigation/Navigation";
import { ImageLinkForm } from "./components/ImageLinkForm/ImageLinkForm";
import { Rank } from "./components/Rank/Rank";
import { FaceRecognition } from "./components/FaceRecognition/FaceRecognition";
import { SignIn } from "./components/SignIn/SignIn";
import { Register } from "./components/Register/Register";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'sign_in',
            isSignedIn: false,
        }
    }

    onRouteChange = (route) => {
        (route === 'sign_out') ? this.setState({ isSignedIn: false })
            :   //(route === 'home') ? this.setState({isSignedIn: true})
            // :   

            this.setState({ route: route })

    }

    calculateFaceLocation = (data) => {
        const clarifaiFaceDetect = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const imageWidth = Number(image.width);
        const imageHeight = Number(image.height);
        console.log(clarifaiFaceDetect, imageWidth, imageHeight)
        return {
            topRow: clarifaiFaceDetect.top_row * imageHeight,
            leftCol: clarifaiFaceDetect.left_col * imageWidth,
            rightCol: imageWidth - (clarifaiFaceDetect.right_col * imageWidth),
            bottomRow: imageHeight - (clarifaiFaceDetect.bottom_row * imageHeight)
        }
    }

    displayFaceBox = (box) => {
        // console.log(box)
        this.setState({ box: box })
    }

    onInputChange = (event) => {
        this.setState({ input: event.target.value })
        console.log('Image URL:', event.target.value);
    }

    onButtonSubmit = () => {
        console.log('Fetching the Image... ')
        this.setState({ imageUrl: this.state.input })

        const PAT = '';         // Enter your PAT
        const USER_ID = '';     // Enter your username  
        const APP_ID = 'facerecognitionbrain-frontend';
        const MODEL_ID = 'face-detection';
        const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
        const IMAGE_URL = this.state.input;

        const raw = JSON.stringify({
            "user_app_id": {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            "inputs": [
                {
                    "data": {
                        "image": {
                            "url": IMAGE_URL
                        }
                    }
                }
            ]
        });

        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Key ' + PAT
            },
            body: raw
        };

        fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
            .then(response => response.json())
            // .then(output => console.log(output))
            // .then(result => console.log(result.outputs[0].data.regions[0].region_info.bounding_box))
            .then(result => this.displayFaceBox(this.calculateFaceLocation(result)))
            .catch(error => console.log('error', error));

    }

    render() {
        const { imageUrl, box, route, isSignedIn } = this.state;
        return (
            <div className="App">
                <ParticlesBg type="coweb" bg={true} />
                <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}></Navigation>
                <Logo></Logo>
                {(route === 'home') ?
                    <div>
                        <Rank></Rank>
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onButtonSubmit={this.onButtonSubmit}>
                        </ImageLinkForm>
                        <FaceRecognition imageUrl={imageUrl} box={box}></FaceRecognition>
                    </div>
                    : (route === 'sign_in') ?
                        <SignIn onRouteChange={this.onRouteChange}></SignIn>
                        : (route === 'sign_up') ?
                            <Register></Register>
                            : console.log('Routing Error!!!')
                }
            </div>
        )
    }
}

//Image sources for Face Detection
// https://cdna.artstation.com/p/assets/images/images/067/669/592/large/blu1304-rey-045.jpg?1695918402
// https://cdnb.artstation.com/p/assets/images/images/054/466/379/large/srinjoy-ganguly-psx-20221001-092004.jpg?1664612784
// https://cdnb.artstation.com/p/assets/images/images/063/215/249/4k/yangzhengnan-cheng-96354404071c52c98052d4326c845126.jpg?1684994813
// https://cdnb.artstation.com/p/assets/images/images/068/370/887/4k/ybz-01-2.jpg?1697640756
// https://cdna.artstation.com/p/assets/images/images/068/370/922/4k/ybz-test-2.jpg?1697640813
// https://cdna.artstation.com/p/assets/images/images/068/265/550/large/caami-galarza-irelia-body-viewport-179-render.jpg?1697404712

//Background Options  (particles-bg)
// "color"
// "ball"
// "lines"
// "thick"
// "circle"
// "cobweb"
// "polygon"
// "square"
// "tadpole"
// "fountain"
// "random"
// "custom"