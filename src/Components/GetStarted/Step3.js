import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {Grid, Button} from '@material-ui/core';
import classNames from 'classnames';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import swal from 'sweetalert';


const styles = theme => ({
  root: {
    color: "#0dad9c",
    '&$checked': {
      color: "#0dad9c",
    },
  },
  button: {
    margin: theme.spacing.unit,
  },
  title: {
    marginTop: theme.spacing.unit * 2,
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
  checked: {},
  center:{
    textAlign:'center'
  }
});

class  Step3 extends Component {

  constructor(props){
    super(props);
    this.state = {
      timeDuration:{
        20:false,
        60:false,
        120:false,
      },
      beverages:{
        COFFEE:false,
        JUICE:false,
        COCKTAIL:false,
      },
    }

    this.getTimeDuration = this.getTimeDuration.bind(this);
    this.getBeverages = this.getBeverages.bind(this);
    this.next2 = this.next2.bind(this);
  }

  getTimeDuration(event){
    let checkbox = this.state.timeDuration;
    checkbox[event.target.value] = event.target.checked;
    this.setState({
      timeDuration:checkbox
    })
  }


  getBeverages(event){
    let check = this.state.beverages;
    check[event.target.value] = event.target.checked;
    this.setState({
      beverages:check
    })
  }


  next2(){
    const {timeDuration, beverages} = this.state;
    let checkBeverages = Object.values(timeDuration).some(item => item === true);
    let checkTimeDuration = Object.values(beverages).some(item => item === true);
    if(!checkBeverages || !checkTimeDuration){
      swal("Error","Select at least one Beverage and Time Duration","error");
    }
    else{
      this.props.beveragesAndDurationTime(beverages, timeDuration, 3);
    }
  }


  render(){
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Grid container spacing={16}>  
          <Grid className={classes.center} item xs={12} sm={12}>
            <Typography variant="h6" gutterBottom>
              Select Beverages
            </Typography>
            <FormControlLabel
              control={
                <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} value="COFFEE" 
                classes={{
                  root: classes.root,
                  checked: classes.checked,
                }}
                checked={this.state.beverages['COFFEE']}
                onChange={this.getBeverages}
                />
              }
              label="COFFEE"
            />
            <FormControlLabel
              control={
                <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />}
                classes={{
                  root: classes.root,
                  checked: classes.checked,
                }}
                value="JUICE" 
                checked={this.state.beverages['JUICE']}
                onChange={this.getBeverages}
                />
              }
              label="JUICE"
            />
            <FormControlLabel
              control={
                <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite 
                  />} value="COCKTAIL" 
                classes={{
                  root: classes.root,
                  checked: classes.checked,
                }}
                checked={this.state.beverages['COCKTAIL']}
                  onChange={this.getBeverages} 
                />
              }
              label="COCKTAIL"
            />
          </Grid>
          <Grid className={classes.center}item xs={12} sm={12}>
            <Typography variant="h6" gutterBottom>
              Duration of Meeting
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.timeDuration['20']}
                  onChange={this.getTimeDuration}
                  value="20"
                  classes={{
                    root: classes.root,
                    checked: classes.checked,
                  }}
                />
              }
              label="20 MIN"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.timeDuration['60']}
                  onChange={this.getTimeDuration}
                  value="60"
                  classes={{
                    root: classes.root,
                    checked: classes.checked,
                  }}
                />
              }
              label="60 MIN"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.timeDuration['120']}
                  onChange={this.getTimeDuration}
                  value="120"
                  classes={{
                    root: classes.root,
                    checked: classes.checked,
                  }}
                />
              }
              label="120 MIN"
            />
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
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

Step3.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Step3);