import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Grid, Button, Typography} from '@material-ui/core';
import classNames from 'classnames';
import swal from 'sweetalert';
import {FIREBASE_STORAGE, FIREBASE_DATABASE} from '../../Helper';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import './index.css';



const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  bootstrapRoot: {
    backgroundColor: '#0dad9c',
    borderColor: '#0dad9c',
    color: '#fff',
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    '&:hover': {
      backgroundColor: '#0dad9c',
      borderColor: '#0dad9c',
      color: '#fff',
    }
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  center:{
      textAlign:'center',
  }
});

class Step4 extends Component {

  constructor(props){
    super(props);
    this.state = {
      imageArr:this.props.imageArr,
      userDetails:this.props.userDetails,
      phone:this.props.phone,
      nickname:this.props.nickname,
      timeDuration:this.props.timeDuration,
      beverages:this.props.beverages,
      coords: null,
      imagePath:[],
      renderTrue:false,
    }

    this.addData = this.addData.bind(this);
    this.updateCoords = this.updateCoords.bind(this);
  }


  componentDidMount() {
    this.setPosition();
  }

   addData(){
    const {imageArr,userDetails, nickname, phone, beverages, timeDuration, coords} = this.state;
    let imageP = [];
    imageArr.map((item,index)=>{
        var randomnmbr = Math.floor(Math.random() * 900000000000000) + 100000000000000;
        const img = `${randomnmbr}.jpg` ;
        const uploadTask = FIREBASE_STORAGE.child(`image/${img}`).put(item);
        uploadTask.on('state_changed', (snap)=>{
        },
        (error)=>{
        console.log(error);
        },
        ()=>{
            FIREBASE_STORAGE.child(`image/${img}`).getDownloadURL()
            .then(url=>{
              imageP.push({imagePath:url})
            })
            .then(()=>{
              FIREBASE_DATABASE.child(`users/${userDetails.uid}`).set({
                images:imageP,
                nickname:nickname,
                phone:phone,
                userDetails:userDetails,
                beverages:beverages,
                timeDuration:timeDuration,
                coords:coords
              })
              .then(()=>{
                  // swal('Congratulations','Your Profile is ready. You can start searching you partner. Happy Dating!','success');
              })
              .catch(err=>{
                  swal('Error!','Something went wrong! Try Again','error');
              })
            })
        });
    })

    this.props.stp(true);
  
  }

  setPosition() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({coords: position.coords})
    });
  }

  updateCoords({latitude, longitude}) {
    this.setState({coords: {latitude, longitude}})
  }

  render(){
    const { classes } = this.props;
    const {coords, imagePath} = this.state;
    console.log(imagePath);
    return (
      <React.Fragment>
        <br/>
        <Typography  className={classes.center} variant="title">
            Select Location
        </Typography>
        <p className={classes.center}>We will find your match near you</p>
        <br />
        <Grid container spacing={16}>  
          <Grid item xs={12} sm={12}>

            {coords && <MyMapComponent
                isMarkerShown
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100vh` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                coords={coords}
                updateCoords={this.updateCoords}
                />
            }

          
            <div className={classes.buttons}>
              <Button
                variant="contained"
                color="primary"
                className={classNames(classes.bootstrapRoot)}
                onClick={this.addData}
              >
                Done
              </Button>
            </div>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

Step4.propTypes = {
  classes: PropTypes.object.isRequired,
};


const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={14}
    center={{ lat: props.coords.latitude, lng: props.coords.longitude }}
  >
    {props.isMarkerShown && 
    <Marker 
      position={{ lat: props.coords.latitude, lng: props.coords.longitude }} 
      draggable={true}
      onDragEnd={position => {
          props.updateCoords({latitude: position.latLng.lat(), longitude: position.latLng.lng()})
      }}
      />}
  </GoogleMap>
))


export default withStyles(styles)(Step4);