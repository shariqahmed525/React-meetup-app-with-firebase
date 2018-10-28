import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Button } from '@material-ui/core';
import { FIREBASE_AUTH } from '../../Helper';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    grow: {
        fontSize: '18px',
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
});


class Appbar extends Component {


    constructor(props) {
        super(props);
        this.state = {
            user: '',
        }
        this.logout = this.logout.bind(this);
    }


    logout() {
        FIREBASE_AUTH.signOut()
            .then(() => {
                this.props.history.push({
                    pathname: '/login',
                    search: '',
                    state: {},
                })
            })
            .catch(err => {
                console.log(err.message);
            });
    }

    render() {

        const { classes } = this.props;

        return (
            <AppBar position="static" style={{ backgroundColor: '#fff' }}>
                <Toolbar style={{ color: '#fff' }}>
                    <div className={classes.grow}>Meetup App</div>
                    <div className={classes.grow} />
                    <Button color="inherit" className={classNames(classes.bootstrapRoot)} onClick={this.logout}>Logout</Button>
                </Toolbar>
            </AppBar>
        );
    }
}


Appbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Appbar);