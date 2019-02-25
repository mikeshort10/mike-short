import React, { Component } from 'react';
import { 
  Switch, 
  Route, 
  BrowserRouter as Router } from 'react-router-dom';
import Granger from './components/Granger';
import LightBright from './components/LightBright';

console.log(`${process.env.PUBLIC_URL}/lindsay-granger`)

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route 
          exact path={`/games/lindsay-granger`} 
          component={ Granger } />
          <Route 
          exact path={`/games/light-bright`} 
          component={ LightBright } />
        </Switch>
      </Router>
    )
  }
}

export default App;
