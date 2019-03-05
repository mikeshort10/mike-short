import React, { Component } from 'react';
import { 
  Switch, 
  Route, 
  BrowserRouter as Router } from 'react-router-dom';
import Granger from './components/Granger';
import LightBright from './components/LightBright';
import Clubs from './components/Clubs';

console.log(`${process.env.PUBLIC_URL}/lindsay-granger`)

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
        </Switch>
      </Router>
    )
  }
}

export default App;
