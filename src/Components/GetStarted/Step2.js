import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Grid} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import img from  './image/default-profile.jpg';
import swal from 'sweetalert';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  imageStyle:{
    height:'150px',
    width:'100%',
    padding:'10px 30px',
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

class Step2 extends Component {
  constructor(props){
    super(props);
    this.state = {
      img1:img,
      img1Original:'',
      img2:img,
      img2Original:'',
      img3:img,
      img3Original:'',
    }
    this.next2 =this.next2.bind(this);
  }

  next2(){
    const {img1Original, img2Original, img3Original} = this.state;
    if((img1Original === img || img1Original === "") || (img2Original === img || img2Original === "") || (img3Original === img || img3Original === "")){
      swal("warning","Please Insert All Images","error");
    }
    else{
      this.props.images(img1Original, img2Original, img3Original, 2);
    }
  }

  onImageChange1(event) {
    if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();
        const img = event.target.files[0];
        reader.onload = (e) => {
            this.setState({img1: e.target.result, img1Original:img});
        };
        reader.readAsDataURL(event.target.files[0]);
    }
}

onImageChange2(event) {
  if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      const img = event.target.files[0];
      reader.onload = (e) => {
          this.setState({img2: e.target.result, img2Original:img});
      };
      reader.readAsDataURL(event.target.files[0]);
  }
}

onImageChange3(event) {
  if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      const img = event.target.files[0];
      reader.onload = (e) => {
          this.setState({img3: e.target.result, img3Original:img});
      };
      reader.readAsDataURL(event.target.files[0]);
  }
}

  render(){
    const { classes } = this.props;
    const { img1, img2, img3} = this.state;
    return (
      <React.Fragment>
        <Typography className={classes.center} variant="title" gutterBottom>
          Select Images
        </Typography>
        <Grid container spacing={24}>
          <Grid item xs={12} md={4}>
            <img src={img1} className={classes.imageStyle}  alt="profile pic" />
            <br />
            <input type="file" onChange={this.onImageChange1.bind(this)} accept="image/*" className="filetype" id="group_image"/>
          </Grid>
          <Grid item xs={12} md={4}>
            <img src={img2} className={classes.imageStyle} alt="profile pic" />
            <br />
            <input type="file" onChange={this.onImageChange2.bind(this)} accept="image/*" className="filetype" id="group_image"/>
          </Grid>
          <Grid item xs={12} md={4}>
            <img src={img3}  className={classes.imageStyle} alt="profile pic" />
            <br />
             <input type="file" onChange={this.onImageChange3.bind(this)} accept="image/*" className="filetype" id="group_image"/>  
          </Grid>
        </Grid>
        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="primary"
            className={classNames(classes.bootstrapRoot)}
            onClick={this.next2}
          >
            Next
          </Button>
        </div>
      </React.Fragment>
    );
}
}
Step2.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Step2);