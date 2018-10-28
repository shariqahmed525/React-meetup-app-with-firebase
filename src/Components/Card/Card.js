import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import './index.css';

const styles = theme => ({
  card: {
    maxWidth: 300,
    margin: "0px auto",
  },
  actions: {
    margin: "0px",
    padding: "0px"
  },
  styl:{
      
  }
});

class RecipeReviewCard extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      index:0
    }
  }

  rmv(index){
    this.props.removeCard(index);
  }

  shw(index, name, uid){
    this.props.showDialog(index, name, uid);
  }


  render() {
    const { classes, images, nickName, index, name, uid, userCoords } = this.props;
    
    return (
      <div style={{ margin: "0px auto" }}>
        <Card className={classes.card}>
          <Carousel showArrows={true}
            showStatus={false}
            showThumbs={false}
            showIndicators={true}
            infiniteLoop={true}
            swipeable={true}
            emulateTouch={true}
            autoPlay={true}>
            {
              images.map((path,index) => (
                <div  key={index}>
                  <img src={path.imagePath} height="300px" alt="user" />
                </div>
              ))
            }
          </Carousel>
          <Grid container
            direction="row"
            justify="center"
            alignItems="center">

            <Grid item xs={2}>
              <Button variant="fab" color="primary"  onClick={this.rmv.bind(this,index)} aria-label="Add" className="btn-margin-left">
                <CloseIcon/>                
              </Button>
            </Grid>
            <Grid item xs={8}>
              <CardContent>
                <Grid>
                  <Typography className="styl" variant="caption">
                    <b>{this.props.children}</b>
                  </Typography>
                </Grid>
                <Grid>
                  <Typography variant="caption" className="styl">{nickName}</Typography>
                </Grid>
              </CardContent>
            </Grid>
            <Grid item xs={2}>
              <Button variant="fab" color="primary" onClick={this.shw.bind(this,index, name, uid, userCoords)} aria-label="Add" className="btn-margin-right">
                <CheckIcon />
              </Button>
            </Grid>
          </Grid>
        </Card>
      </div>
    );
  }
}

RecipeReviewCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RecipeReviewCard);
