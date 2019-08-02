import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import App from './App';
import Search from './components/Search'
import Login from './components/Login'
import Logout from './components/Logout'
import NotFound from './components/NotFound'

import { createBrowserHistory } from 'history'
import { Router, Route, Switch } from 'react-router-dom';
// import logger from 'redux-logger';

const history = createBrowserHistory();


ReactDOM.render(
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/search" component={Search} />
      <Route exact path="/edit" component={Search} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/logout" component={Logout} />
      <Route component={NotFound} />
    </Switch>
  </Router>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
