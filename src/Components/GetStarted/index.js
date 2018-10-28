import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import './index.css';
import Typography from '@material-ui/core/Typography';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import loader from './image/ajax-loader.gif';
import Appbar from '../Appbar/Appbar';
import {FIREBASE_AUTH} from '../../Helper';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  overlay:{
    position: 'absolute',
    height: `175vh`,
    zIndex:'100',
    width: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
  },
  imageStyle:{
    height:'100px',
    marginBottom:'12px',
    borderRadius: '100%',
  },
  grow: {
    flexGrow: 1,
    fontSize:'18px',
    color: '#0dad9c',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3,
    },
  },
  bootstrapRoot: {
    backgroundColor: '#0dad9c',
    borderColor: '#0dad9c',
    color: '#fff',
    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    '&:hover': {
      backgroundColor: '#0dad9c',
      borderColor: '#0dad9c',
      color: '#fff'
    }
  },
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
  },
  loaderImg:{
    position: "absolute",
    top: '25%',
    height: '100px',
    left: '47%',
  }
});


class GetStarted extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        activeStep: 0,
        isRender:false,
        imageArr:[],
        nickname:'',
        check:(this.props.location.state) ? this.props.location.state.loginFirst : false,
        phone:'',
        userDetails:null,
        timeDuration:null,
        beverages:null,
        loaderStep:false,
    }
    this.checkLogin();
    this.logout = this.logout.bind(this);
    this.getNameAndPhoneAndStep = this.getNameAndPhoneAndStep.bind(this);
    this.getImages = this.getImages.bind(this);
    this.beveragesAndDurationTime = this.beveragesAndDurationTime.bind(this);
    this.stp = this.stp.bind(this);
  }

  getNameAndPhoneAndStep(nickname, phone, step){
    this.setState({
      nickname:nickname,
      phone:phone,
      activeStep: step
    })
  }

  getImages(img1, img2, img3, step){
    let imageArr = this.state.imageArr;
    imageArr.push(img1, img2, img3);
    this.setState({
      imageArr,
      activeStep: step,
    })
  }

  beveragesAndDurationTime(beverages, timeDuration, step){
    this.setState({
      beverages:beverages,
      timeDuration:timeDuration,
      activeStep: step,
    })
  }

  stp(st){
    this.setState({
      loaderStep:true
    })
  }

  
getStepContent(step) {
  const {imageArr, phone, nickname, userDetails, beverages, timeDuration} = this.state;
  switch (step) {
    case 0:
      return <Step1 nameAndphoneAndStep={this.getNameAndPhoneAndStep}/>;
    case 1:
      return <Step2 images={this.getImages}/>;
    case 2:
      return <Step3 beveragesAndDurationTime={this.beveragesAndDurationTime}/>;
    case 3:
    return <Step4 imageArr={imageArr} stp={this.stp}  beverages={beverages} timeDuration={timeDuration}  userDetails={userDetails} phone={phone} nickname={nickname}/>;
    default:
      throw new Error('Unknown step');
  }
}

  checkLogin(){
    const {check} = this.state;
    FIREBASE_AUTH.onAuthStateChanged(user=>{
      if(user && check){
        this.setState({
          isRender:true,
          userDetails:user.providerData[0]
        })
      }
      else{
       this.props.history.push('/'); 
      }
    })
  }

  logout(){
    FIREBASE_AUTH.signOut()
    .then(()=>{
      this.props.history.push({pathname:'/login'});
    })
    .catch(err=>{
      console.log("Error***",err);
    })
  }

  renderLoader(){
    const { classes } = this.props;
    
    setTimeout(()=>{
      this.props.history.push({
        pathname:'/',

      })
    },3000)

    return(
      <div className={classes.overlay}>
        <img src={loader} className={classes.loaderImg} alt="loader"/>
      </div>
    );

  }

  render() {
    const { classes } = this.props;
    const { activeStep, loaderStep, isRender, userDetails } = this.state;
    return (
      <div id="body">
        { (loaderStep) ? this.renderLoader() : ''}
        {isRender && 
      <React.Fragment>  
        <CssBaseline />
        <Appbar {...this.props}/>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            {
              (activeStep !== 0) ? '' : <div>
                <center>
                  <img src={userDetails.photoURL} className={classes.imageStyle} alt="profile pic" />
                </center>
                <Typography variant="title" align="center">
                  Welcome {userDetails.displayName}
                </Typography>
              </div>
            }
            <br />
            <React.Fragment>              
                {this.getStepContent(activeStep)}
            </React.Fragment>
          </Paper>
        </main>
      </React.Fragment> 
        }
      </div>
    );
  }
}

GetStarted.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GetStarted);