import React from 'react';
import '../styles/main.scss';
// import fire from './fire';

const vision = require('react-cloud-vision-api');
vision.init({auth: 'AIzaSyAdJBBzi66kjNNwvPjCKcWBHpnR68IbIj8'});

class Faces extends React.Component {

    constructor(props) {
    super(props);
    this.dimensions = React.createRef()
    this.state = {
        angerLikelihood: [],
        blurredLikelihood: [],
        headwearLikelihood: [],
        joyLikelihood: [],
        sorrowLikelihood: [],
        surpriseLikelihood: [],
    };
    }


    convertBase64 = (file) => {
        return new Promise((resolve, reject) =>{
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = (()=> {
                resolve(fileReader.result);
            });
            fileReader.onerror = ((error) => {
                reject(error);
            });
        });
    };

    uploadImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await this.convertBase64(file);
        this.setState({base64: base64, imageProps: file});
        this.apiRequest();
    }

    apiRequest() {      
        const req = new vision.Request({
        image: new vision.Image({
            base64: this.state.base64,
        }),
        features: [new vision.Feature('FACE_DETECTION', 2),]
        })

        vision.annotate(req)
        .then((res) => {
            var angerLikelihood = res.responses[0].faceAnnotations[0].angerLikelihood
            var blurredLikelihood = res.responses[0].faceAnnotations[0].blurredLikelihood
            var headwearLikelihood = res.responses[0].faceAnnotations[0].headwearLikelihood
            var joyLikelihood = res.responses[0].faceAnnotations[0].joyLikelihood
            var sorrowLikelihood  = res.responses[0].faceAnnotations[0].sorrowLikelihood
            var surpriseLikelihood = res.responses[0].faceAnnotations[0].surpriseLikelihood

            this.setState({
                angerLikelihood:  this.getFaces(angerLikelihood),
                blurredLikelihood:  this.getFaces(blurredLikelihood),
                headwearLikelihood: this.getFaces(headwearLikelihood),
                joyLikelihood: this.getFaces(joyLikelihood),
                sorrowLikelihood: this.getFaces(sorrowLikelihood),
                surpriseLikelihood:  this.getFaces(surpriseLikelihood),
                })

            this.gridDot();
            this.setDistance();


        }, (e) => {
        alert("foutje")
        });
    }

    gridDot() {
        this.setState({


        });
    }

    setDistance() {
        this.setState({

        })
    }


    getFaces = (x) => {
        if (x === "VERY_LIKELY") {
                x = "100%";
        }else if (x === "LIKELY") {
            x = "75%"
        } else if (x === "POSSIBLE"){
            x = "50%"
        } else if (x === "UNLIKELY") {
            x = "25%"
        }else if (x === "VERY_UNLIKELY") {
            x = "0%"
        }
        return x;
    }


render() {
    
return (
<div className="rule-of-thirds">
    <div className="rule-of-thirds__image">
            {this.state.logo}
        <img ref={this.dimensions} src={this.state.base64} alt="afbeelding" />
    </div>

    <div>Boos:{this.state.angerLikelihood}</div>
    <div>Geblurred:{this.state.blurredLikelihood}</div>
    <div>Hoofddraagsels:{this.state.headwearLikelihood}</div>
    <div>Blij:{this.state.joyLikelihood}</div>
    <div>Sip:{this.state.sorrowLikelihood}</div>
    <div>Verbaasd:{this.state.surpriseLikelihood}</div>
    

    <button onClick={this.handleSubmit}>Save</button>
    <input className="filetest" type="file" onChange={(e)=> {
    this.uploadImage(e);
    }} />
</div>
)};

};

export default Faces;