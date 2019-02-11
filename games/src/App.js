import React, { Component } from 'react';
import { 
  Switch, 
  Route, 
  BrowserRouter as Router } from 'react-router-dom';
import Granger from './components/Granger';

console.log(`${process.env.PUBLIC_URL}/lindsay-granger`)

class App extends Component {
  render() {
  	console.log('x')
    return (
      <Router basename='/games' >
        <Switch>
          <Route 
          exact
          path={`/lindsay-granger`} 
          component={ Granger } />
        </Switch>
      </Router>
    )
  }
}

export default App;
