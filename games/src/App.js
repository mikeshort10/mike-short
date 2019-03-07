import React, { Component } from 'react';
import { 
  Switch, 
  Route, 
  BrowserRouter as Router } from 'react-router-dom';
import Granger from './components/Granger';
import LightBright from './components/LightBright';
import Clubs from './components/Clubs';
import Calculator from './components/Calculator.js';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route 
          path={`/games/lindsay-granger`} 
          component={ Granger } />
          <Route 
          path={`/games/light-bright`} 
          component={ LightBright } />
          <Route 
          path={`/clubs`} 
          component={ Clubs } />
          <Route 
          path={`/trip-calculator`} 
          component={ Calculator } />
        </Switch>
      </Router>
    )
  }
}

export default App;
