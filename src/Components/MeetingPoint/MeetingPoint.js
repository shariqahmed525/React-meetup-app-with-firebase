import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Button, Typography, Grid,  Card, CardActions, CardContent, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Divider   } from '@material-ui/core';
import { FIREBASE_DATABASE, CLIENT_ID, CLIENT_SECRET } from '../../Helper';
import Appbar from '../Appbar/Appbar';
import NearMeIcon from '@material-ui/icons/NearMe';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    showText: {
        textAlign: 'center',
        fontSize: '22px',
        marginTop: '50px',
    },
    demo: {
        padding: "30px 2px",
    },
    card: {
        maxWidth: 300,
        width: 300,
        height: 250
    },
    media: {
        objectFit: 'cover',
    },
    floatRight: {
        float: 'right',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginTop: 30,
        marginBottom: 30,
        width: 300,
    },
    list:{
        width: '100%',
        maxWidth: 460,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        padding:'10px',
        marginBottom: 50,
        border:'1px solid rgba(0, 0, 0, 0.3)',
    },
    listSection:{
        padding:'10px',
        fontSize:'15px',
    }
});


class MeetingPoint extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isRender: false,
            userData: {},
            ourData: [],
            check: (this.props.location.state) ? this.props.location.state.isCheck : false,
            uid: (this.props.location.state) ? this.props.location.state.uid : '',
            name: (this.props.location.state) ? this.props.location.state.name : '',
            myCoords: (this.props.location.state) ? this.props.location.state.myCoords : '',
            userCoords: (this.props.location.state) ? this.props.location.state.userCoords : '',
            recommendedPlace: [],
            queryPlaces:[],
            query: '',
            isRecommendedBtnShow:null,
            listShow:false,
            isShow:null,
            venueLat:'',
            venueLng:'',
        }
        this.handleChange = this.handleChange.bind(this);
        this.querySubmit = this.querySubmit.bind(this);
        this.navigateToDateTime = this.navigateToDateTime.bind(this);
    }

    checkLoginStatus() {
        const { check } = this.state;
        if (check) {
            this.setState({
                isRender: true
            })
        }
        else {
            this.props.history.push({
                pathname: '/login'
            })
        }
    }

    componentDidMount() {
        this.checkLoginStatus();
        this.fetchUserData();
        this.fetchOurData();
        this.fetchRecommendedPlace();
    }

    fetchUserData() {
        let { uid } = this.state;
        FIREBASE_DATABASE.child(`users/${uid}`).on('value', snap => {
            let obj = snap.val();
            this.setState({
                userData: obj
            })
        })
    }

    fetchOurData() {
        let myUid = localStorage.getItem('sa-meetupappUid');
        FIREBASE_DATABASE.child(`users/${myUid}`).on('value', snap => {
            let obj = snap.val();
            this.setState({
                ourData: obj
            })
        })
    }

    fetchRecommendedPlace() {
        const { myCoords, recommendedPlace } = this.state;
        let A = (myCoords) ? myCoords[0] : '';
        let B = (myCoords) ? myCoords[1] : '';
        fetch(`https://api.foursquare.com/v2/venues/explore?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323&limit=3&ll=${A},${B}`)
            .then(res => res.json())
            .then(res => {
                recommendedPlace.push(res.response.groups[0].items);
                this.setState({ recommendedPlace, recommendRender: true })
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    handleChange(event) {
        this.setState({
            query: event.target.value,
        });
    };

    querySubmit(e){
        let {query} = this.state;
        let queryPlaces = [];
        e.preventDefault();
        if(query !== ""){
            fetch(`https://api.foursquare.com/v2/venues/search?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323&near=${query}`)
            .then(res => res.json())
            .then(res => {
                queryPlaces.push(res.response.venues);
                this.setState({ queryPlaces, listShow: true })
            })
            .catch(err => {
                console.log(err.message);
            })
        }
        else{
            this.setState({listShow: false})            
        }
    }

    setVenue(lat,lng,index){
        this.setState({isShow:index, venueLat:lat, venueLng:lng})        
    }

    setRecommendedVenue(lat,lng,index){
        this.setState({isRecommendedBtnShow:index, venueLat:lat, venueLng:lng})        
    }

    navigateToDateTime(){
        const { venueLat, venueLng,uid } = this.state;
        this.props.history.push({
            pathname:'/setdate',
            search:'',
            state:{
                venueLat:venueLat,
                venueLng:venueLng,
                isCheck:true,
                userUid:uid,
            }    
        })
    }


    render() {
        const { isRender, listShow, query, isShow, isRecommendedBtnShow, recommendedPlace, queryPlaces } = this.state;
        const { classes } = this.props;
        return (
            <div>
                {isRender &&
                    <div>
                        <Appbar {...this.props}/>
                        <Typography className={classes.showText} variant="h6">
                            Search places for meeting
                        </Typography>


                        {this.state.recommendRender ? <Grid container className={classes.root}>
                            <Grid xs={12} item>
                                <Grid container justify="center">
                                    <form className={classes.container} onSubmit={this.querySubmit} noValidate autoComplete="off">
                                        <TextField
                                            id="standard-name"
                                            label="Enter Area Name"
                                            className={classes.textField}
                                            value={query}
                                            onChange={this.handleChange}
                                            margin="dense"
                                        />
                                    </form>
                                </Grid>
                            </Grid>
                            { listShow && <Grid xs={12} item>
                                <Grid container justify="center">
                                    <div className={classes.list}>
                                        <List className={classes.listSection}>
                                            {queryPlaces[0] !== undefined  ? queryPlaces[0].map((value, index) => {
                                                return(
                                                    <span>
                                                        <ListItem key={index} role={undefined} onClick={this.setVenue.bind(this,value.location.lat,value.location.lng,index)} dense button >
                                                            <ListItemText primary={`${value.name}`} />
                                                            {isShow === index ?  <ListItemSecondaryAction>
                                                                <IconButton color="secondary" aria-label="near">
                                                                    <NearMeIcon />
                                                                </IconButton>
                                                                <IconButton color="primary" onClick={this.navigateToDateTime} aria-label="navigate">
                                                                    <NavigateNextIcon />
                                                                </IconButton>
                                                            </ListItemSecondaryAction> : ''}
                                                        </ListItem>
                                                        <Divider />
                                                    </span>
                                                )
                                            }) : <center><span>NO RESULT</span></center>}
                                        </List>
                                    </div>
                                </Grid>
                            </Grid>}
                            <Grid xs={12} item>
                                <Grid container justify="center">
                                    <Typography variant="h6">
                                        Recommended Places
                        </Typography>
                                </Grid>
                            </Grid>
                            {recommendedPlace[0].map((item, index) => {
                                return (
                                    <Grid key={index} item lg={4} md={4} sm={12} xs={12}>
                                        <Grid container justify="center">
                                            <Grid className={classes.demo} item>
                                                <Card className={classes.card}>
                                                    <CardContent>
                                                        <Typography gutterBottom variant="h5" component="h2">
                                                            {item.venue.name}
                                                        </Typography>
                                                        <Typography gutterBottom component="p">
                                                            {item.venue.location.formattedAddress[0]}, {item.venue.location.formattedAddress[1]}
                                                        </Typography>
                                                        <Typography gutterBottom variant="h6" component="h3">
                                                            Distance
                                        </Typography>
                                                        <Typography component="p">
                                                            {item.venue.location.distance}m distance from your location
                                        </Typography>
                                                    </CardContent>
                                                    <CardActions >
                                                        <Button onClick={this.setRecommendedVenue.bind(this,item.venue.location.lat,item.venue.location.lng,index)} size="small" color="primary">
                                                            Make Venue
                                                        </Button>
                                                        {isRecommendedBtnShow === index ? <span>
                                                            <Button size="small" color="secondary">
                                                                <NearMeIcon />                              
                                                            </Button>
                                                            <Button size="small"  onClick={this.navigateToDateTime} color="primary">
                                                                <NavigateNextIcon />
                                                            </Button>
                                                        </span>:''}
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )
                            })}
                        </Grid> : ''}
                        <br />
                    </div>
                }


            </div>
        );
    }
}

MeetingPoint.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MeetingPoint);
