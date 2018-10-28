import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import {TextField, Button} from '@material-ui/core';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';


const styles = theme => ({
  grow: {
    flexGrow: 1,
    fontSize:'18px',
    color: '#0dad9c',
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
});

class Step1 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nickname: '',
      phone: '',
    }
  }

  
  next() {
    const {nickname,phone} = this.state;
    if(phone === "" && nickname === ""){
      this.setState({phoneError:true, nickNameError:true})
    }
    else if(nickname === ""){
      this.setState({nickNameError:true})
    }
    else if(phone === ""){
      this.setState({phoneError:true})
    }
    else if(nickname !== "" || phone !== ""){
      this.props.nameAndphoneAndStep(nickname, phone, 1);
    }
    else{
      console.log("errr")
    }
  }

  render() {
    const { nickname, phone } = this.state;
    const {classes} = this.props;
    var err1 = (this.state.nickNameError) ? true : false;
    var err2 = (this.state.phoneError) ? true : false;
    return (
      <React.Fragment>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <TextField
              required
              error={err1}
              id="nickName"
              name="nickName"
              label="Nick Name"
              fullWidth
              value={nickname}
              onChange={(e) => { this.setState({ nickname: e.target.value, nickNameError: false }) }}
              autoComplete="nickname"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              error={err2}
              id="phoneNum"
              name="phoneNum"
              label="Phone Number"
              fullWidth
              value={phone}
              onChange={(e) => { this.setState({ phone: e.target.value , phoneError:false}) }}
              autoComplete="phoneNum"
            />
          </Grid>
        </Grid>
        <div className={classes.buttons}>
        <Button
          variant="contained"
          color="primary"
          dir="ltr"
          className={classNames(classes.bootstrapRoot)}
          onClick={this.next.bind(this)}
        >
          Next
        </Button>
        </div>
      </React.Fragment>
    );
  }
}
Step1.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Step1);