import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import { Button, Typography, Grid, TextField } from '@material-ui/core';
import {FIREBASE_DATABASE, FIREBASE_AUTH} from '../../Helper';
import swal from 'sweetalert';
import Appbar from '../Appbar/Appbar';

const styles = theme => ({
  bootstrapRoot: {
    backgroundColor: '#0dad9c',
    borderColor: '#0dad9c',
    color: '#fff',
    boxShadow: '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)',
    '&:hover': {
      backgroundColor: '#0dad9c',
      borderColor: '#0dad9c',
      color: '#fff'
    }
  },
  showText: {
    textAlign: 'center',
    fontSize: '25px',
    marginTop: '65px',
  },
    container: {
        flexWrap: 'wrap',
    },
    textField: {
        margin:'50px 10px',
        width: '300px',
    },
});


function getDateDiff(dateOne, dateTwo) {
  if(dateOne.charAt(2)=== '-' & dateTwo.charAt(2) === '-'){
      dateOne = new Date(formatDate1(dateOne));
      dateTwo = new Date(formatDate2(dateTwo));
  }
  else{
      dateOne = new Date(dateOne);
      dateTwo = new Date(dateTwo);            
  }
  let timeDiff = dateOne.getTime() - dateTwo.getTime();
  let diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
  let message = diffDays;
  return message;
}

function formatDate1(date) {
   return date.split('-').reverse().join('-');
}

function formatDate2(date) {
  return date.split('/');
}

class SetDate extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isRender: false,
      check:(this.props.location.state)  ? this.props.location.state.isCheck :false,
      userUid: (this.props.location.state) ? this.props.location.state.userUid : '',
      venueLat: (this.props.location.state) ? this.props.location.state.venueLat : '',
      venueLng: (this.props.location.state) ? this.props.location.state.venueLng : '',
      myCoords: (this.props.location.state) ? this.props.location.state.myCoords : '',
      userCoords: (this.props.location.state) ? this.props.location.state.userCoords : '',
      date:'',
      myUid:'',
      time:'00:00',
    }
  }

  checkLoginStatus() {
    const {check} = this.state;
    if(check){
      this.setState({
        isRender:true
      })
    }
    else{
      this.props.history.push({
        pathname:'/login'
      })
    }
  }

  componentDidMount() {
    this.checkLoginStatus();
    FIREBASE_AUTH.onAuthStateChanged(user=>{
      if(user){
        console.log(user.providerData[0].uid);
        this.setState({
          myUid:user.providerData[0].uid
        })
      }
      else{
        this.props.history.push('/login');
      }
    })
  }


  handleChange = name => event => {
    if(name === "time"){
      let times = {}, 
      re = /^\d+(?=:)/;
      for (let i = 13, n = 1; i < 24; i++, n++) {
        times[i] = n < 10 ? "0" + n : n
      }
      let time = event.target.value;
      let match = time.match(re)[0];
      let newTime = (match && match >= 13 ? time.replace(re, times[match]) : time)
      this.setState({
        [name]:newTime
      }) 
    }
    else{
      this.setState({
        [name]: event.target.value,
      });
    }
  };

  setMeeting(){
    const {date, time, userUid, myUid, venueLat, venueLng} = this.state
    var dat = new Date().toLocaleDateString();
    let c = getDateDiff(date, dat);
    if(date === ''){
      swal('Error','Select Date Please','warning');
    }
    else if(c < 0){
      swal('Error',"Don't Select Past Date",'warning');
    }
    else if(time === '00:00'){
      swal('Error','Select Time Please','warning');
    }
    else{
      FIREBASE_DATABASE.child(`/meetings/${myUid}`).set({
        myUid:myUid,
        userUid:userUid,
        venueLat:venueLat,
        venueLng:venueLng,
        meetUpdate:date,
        sendRequestDate:dat,
      })
      .then(()=>{
        this.props.history.push('/');
      })
      .catch(err=>{
        console.log(err.message);
      })
    }
  }

  


  render() {
    const {isRender} = this.state;
    const { classes } = this.props;
    const {date, time} = this.state
    return (
      <div>
        {isRender &&
          <div>
            <Appbar {...this.props}/>
            <Typography className={classes.showText} variant="h6">
              Set Date And Time of Meeting
            </Typography>
            <Grid container>
                <Grid xs={12} item>
                    <Grid container justify="center">
                      <center>
                        <form className={classes.container} noValidate>
                          <TextField
                              id="dater"
                              label="Set Date"
                              type="date"
                              defaultValue={date}
                              onChange={this.handleChange('date')}
                              className={classes.textField}
                              InputLabelProps={{
                              shrink: true,
                              
                              }}
                          />
                          <TextField
                              id="time"
                              label="Set Time"
                              type="time"
                              defaultValue={time}
                              className={classes.textField}
                              InputLabelProps={{
                              shrink: true,
                              }}
                              onChange={this.handleChange('time')}
                              inputProps={{
                              step: 300, // 5 min
                              }}
                          />
                      </form>
                      <Button onClick={()=>this.setMeeting()} className={classNames(classes.bootstrapRoot)}>Set Meeting</Button>
                      </center>
                    </Grid>
                </Grid>
            </Grid>
          </div>
        }

        
      </div>
    );
  }
}

SetDate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SetDate);
