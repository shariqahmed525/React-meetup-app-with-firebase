import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {Typography } from '@material-ui/core';
import {FIREBASE_DATABASE } from '../../Helper';
import Appbar from '../Appbar/Appbar';
import UserCard from '../UserCard/';
import './index.css';

const styles = theme => ({
  root: {
    maxWidth: 400,
    flexGrow: 1,
    borderRadius: '5px',
    overflow: 'hidden',
    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
  },
  header: {
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#fff',
  },
  grow: {
    fontSize: '18px',
    flexGrow: 1,
    color: '#0dad9c',
  },
  showText: {
    textAlign: 'center',
    fontSize: '25px',
    marginTop: '65px',
  },

});


class Meeting extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isRender: false,
      check:(this.props.location.state)  ? this.props.location.state.isCheck :false,
      myLocation:[], 
      myOptions:[{}],
      coords:{},
    }
    this.navigate = this.navigate.bind(this);
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
    let { myLocation, myOptions} = this.state
    let myUid = localStorage.getItem('sa-meetupappUid');
    FIREBASE_DATABASE.child(`users/${myUid}`).on('value', snap => {
    let obj = snap.val();
    myLocation.push(obj.coords.latitude);
    myLocation.push(obj.coords.longitude);
    myOptions.beverages = obj.beverages;
    myOptions.time = obj.timeDuration;
      this.setState({
        myLocation, myOptions 
      })
    })
  }

  navigate(name,uid,index, userCoords){
    let { myLocation} = this.state
    if(name !== "" && uid !== "" && index !== ""){
      this.props.history.push({
        pathname:`/meetingpoint`,
        search:'',
        state:{
          name:name,
          uid:uid,
          index:index,
          isCheck:true,
          myCoords:myLocation,
          userCoords:userCoords,
        }
      })
    }
    else{

    }
  }

  render() {
    const {isRender, myLocation, myOptions} = this.state;
    const { classes } = this.props;
    return (
      <div>
        {isRender &&
          <div>
            <Appbar {...this.props}/>
            <Typography className={classes.showText} variant="h6">
              Your Nearest Match
                </Typography>

              <div id="viewport">
                <div className="master-root" >
                  {
                    (myLocation.length > 0) && <UserCard pageNavigate={this.navigate} className="no-overflow" myLocation={myLocation} myOptions={myOptions}/>
                  }
                </div>
              </div>
            <br />
          </div>
        }

        
      </div>
    );
  }
}

Meeting.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Meeting);
