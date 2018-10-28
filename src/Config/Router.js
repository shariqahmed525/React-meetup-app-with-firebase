import React from 'react';
import { Router, Route} from "react-router-dom";
import Login from '../Components/Login/Login';
import Home from '../Components/Home/Home';
import Meeting from '../Components/Meeting/Meeting';
import MeetingPoint from '../Components/MeetingPoint/MeetingPoint';
import SetDate from '../Components/SetDate/SetDate';
import GetStarted from '../Components/GetStarted/index';
import createBrowserHistory from 'history/createBrowserHistory';
const customHistory = createBrowserHistory();

const AppRoute = () => (
    <Router history={customHistory}>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/meeting" component={Meeting} />
        <Route path="/meetingpoint" component={MeetingPoint} />
        <Route path="/setdate" component={SetDate} />
        <Route path="/getstarted" component={GetStarted} />
      </div>
    </Router>
);

export default AppRoute;