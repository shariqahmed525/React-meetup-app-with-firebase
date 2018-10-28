import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {Button, Typography } from '@material-ui/core';
import {FIREBASE_AUTH, FIREBASE_DATABASE } from '../../Helper';
import Appbar from '../Appbar/Appbar';
import AddIcon from '@material-ui/icons/Add';

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
    boxShadow:'0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)',
    '&:hover': {
      backgroundColor: '#0dad9c',
      borderColor: '#0dad9c',
      color: '#fff'
    }
  },
  showText:{
    textAlign:'center',
    fontSize:'25px',
    marginTop:'65px',
  },
  button:{
    bottom:'40px',
    right:'40px',
    position:'absolute',
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});




class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: (this.props.location.state) ? this.props.location.state.providerData : [],
      check:(this.props.location.state)  ? this.props.location.state.isCheck :false,
      isRender:true,
    }
  }

  checkLoginStatus(){
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

  componentDidMount(){
    this.checkLoginStatus();
    FIREBASE_DATABASE.child('users').on('value',snap=>{
      let allData = [];
      snap.forEach(snapshot=>{
        let obj = snapshot.val();
        obj.ref = "card";
        allData.push(obj);
      })
      this.setState({
        allUsers:allData,
      })
    })
  }

  render() {
    const {isRender,user} = this.state;
    const {classes} = this.props;
    return (
        <div>
          { isRender &&
              <div>
                <Appbar {...this.props}/>
                <Typography variant="h6">
                  <p className={classes.showText}>
                  <q>
                  You haven’t done any meeting yet!, try creating a new meeting!</q></p>
                </Typography>
                <Button variant="extendedFab" onClick={()=>{this.props.history.push({pathname:'/meeting',search:'',state: {user:user,allUsers:this.state.allUsers,isCheck:true,}})}} aria-label="Delete" className={classes.button}>
                  <AddIcon className={classes.extendedIcon} />
                  Set a meeting!
                </Button>
              </div> 
          }
        </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);