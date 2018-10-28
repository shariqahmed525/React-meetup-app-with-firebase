import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {Button } from '@material-ui/core';
import { PROVIDER, FIREBASE_AUTH, FIREBASE_DATABASE } from '../../Helper';
import MeetupBackground from './images/meetup.jpg'; 

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    fontSize:'18px',
    flexGrow: 1,
    color: '#0dad9c',
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
  background:{
      height:`89vh`,
      width:'100%',
      position:'relative',
  },
  quote:{
      position:'absolute',
      top:'48%',
      left:'10%',
      right:'10%',
      color:'#fff',
      zIndex:'100',
      fontSize:'16px',
      textAlign:'center',
  }
});

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: '',
      isRender:false,
    }
    this.login = this.login.bind(this);
    this.checkLogin();
  }

  checkLogin(){
    FIREBASE_AUTH.onAuthStateChanged(user=>{
        if(user){
            this.props.history.push({
                pathname:'/',
                search:'',
                state:{
                  isCheck:true
                }
            })
        }
        else{
            this.setState({
                isRender:true
            })
        }
    })
  }

  login() {
    let arr = null;
    FIREBASE_AUTH.signInWithPopup(PROVIDER)
      .then((result)=> {
        var user = result.user.providerData[0].uid;
        localStorage.setItem('sa-meetupappUid',user);
        FIREBASE_DATABASE.child(`users/${user}`).on('value',snap=>{
         let res = snap.numChildren();
         snap.forEach(snapshot=>{
            arr = snapshot.val();
         })
          if(res > 0){
            this.props.history.push({
              pathname: '/',
              search: '',
              state: {providerData:arr}
            })
          }
          else{
            this.props.history.push({
              pathname: '/getstarted',
              search: '?isLogin=true',
              state: {loginFirst:true}
            })
          }
        })
      })
      .catch(function (error) {
         console.log('error.message***********',error.message); 
      });
  }

  render() {

    const { classes} = this.props;
    const {isRender} = this.state;

    return (
        <div>
            {isRender && <div>
                    <AppBar position="static" style={{ backgroundColor: '#fff' }}>
                        <Toolbar style={{ color: '#fff' }}>
                            <div className={classes.grow}>Meetup App</div>
                            <div className={classes.grow} />
                            <Button color="inherit" className={classNames(classes.bootstrapRoot)} onClick={this.login}>Login</Button>
                        </Toolbar>
                    </AppBar>
                    <span className={classes.quote}><q>A person meets thousands of different people across a lifetime, a woman thousands of different men, of all shades, and many more if she constantly passes through different parts of the world. Even so, of the many different people a person on average meets it is rare for one to fit almost immediately in harmony and general interest. For all the choices available the odds are enormous.The miracle is there to be grasped.</q></span>
                    <img src={MeetupBackground} className={classes.background} alt="background" />
                </div>
            }
        </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);