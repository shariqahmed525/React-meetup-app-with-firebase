import React, { Component } from "react";
import Cards, { Card } from "react-swipe-deck";
import MUICard from "../Card/Card";
import {FIREBASE_DATABASE } from '../../Helper';
import geofire from "geofire";
import './index.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Redirect } from "react-router-dom";

const isEqual = (obj1, obj2) => {
    const obj1Val = Object.values(obj1);
    const obj2Val = Object.values(obj2);
    for(let i=0; i<obj1Val.length;i++){
       if((obj1Val[i] === true) && (obj2Val[i] === true)){
           return true;
       }
    }
}

function Transition(props) {
  return <Slide direction="down" {...props} />;
}


class UserCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allUsers: [],
      name:'',
      open: false,
      uid:'',
      userCoords:null,
      myLocation: props.myLocation,
      myOptions: props.myOptions,
      coords:props.myOptions,
    }
    this.remove = this.remove.bind(this);
    this.show = this.show.bind(this);
    this.okay = this.okay.bind(this);
  }


  handleClose = () => {
    this.setState({ open: false });
  };



  getAllUsers() {
    let { allUsers, myLocation, myOptions } = this.state
    let myUid = localStorage.getItem('sa-meetupappUid');
    FIREBASE_DATABASE.child('users').on("child_added", data => {
      let user = data.val();
      if (user.userDetails.uid !== myUid) {
        let userLocation = [user.coords.latitude, user.coords.longitude];
        let distance = geofire.distance(myLocation, userLocation).toFixed(3);
        let compareBeverages = isEqual(myOptions.beverages, user.beverages);
        let compareTime = isEqual(myOptions.time, user.timeDuration);
        if(distance <= 5 && compareBeverages === true && compareTime === true){
            allUsers.push(user)
            this.setState({ allUsers })
        }
      }
    })
  }

  componentDidMount() {
    this.getAllUsers()
  }

  actionLeft(index){
    // console.log("left");
  }

  remove(index){
    let { allUsers } = this.state
    allUsers.splice(index,1);
    this.setState({allUsers})
  }

  show(index,nm, id, uCoords){
    let { name, uid, userCoords} = this.state
    name = nm;
    uid = id;
    userCoords = uCoords;
    this.setState({name,uid,userCoords,open:true})
  }

  actionRight(index, nm, id){
    this.setState({index,name:nm,uid:id,open:true})
  }

  okay(){
    const {name,uid,index,userCoords} = this.state;
    this.props.pageNavigate(name,uid,index,userCoords);
  }

  action(){

  }

  render() {
    let { allUsers, name } = this.state
    let a = (document.getElementById('targetChild') !== null) ? document.getElementById('targetChild').getElementsByTagName('div')[0].setAttribute( 'class', 'root-master' ) : null;
    
    let b = (document.getElementById('targetChild') !== null) ? document.getElementById('targetChild').getElementsByTagName('div')[0].getElementsByTagName('div')[0].setAttribute( 'class', 'append-width' ) : null;

    return (
      <div id="targetChild"> 
        <Cards onEnd={() => this.action("end")}>
          {allUsers.map((item,index) => (
            <Card
              key={index}
              onSwipeLeft={this.actionLeft.bind(this,index)}
              onSwipeRight={this.actionRight.bind(this,index, item.userDetails.displayName, item.userDetails.uid)}
            >
              <MUICard images={item.images} removeCard={this.remove} userCoords={item.coords} name={item.userDetails.displayName} showDialog={this.show} index={index} nickName={item.nickname} uid={item.userDetails.uid}>
                <p>{item.userDetails.displayName}</p>
              </MUICard>
            </Card>
          ))}
        </Cards>

          <Dialog
            open={this.state.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {`Confirmation`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
              {`Do you want to meet ${name}?`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                No
              </Button>
              <Button onClick={this.okay} color="primary">
                Yes
              </Button>
            </DialogActions>
          </Dialog>

        </div>
    );
  }
};

export default UserCard;
