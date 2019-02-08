import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Granger from './components/Granger';

console.log(<Granger />)

class App extends Component {
  render() {
  	console.log('x')
    return (
      <Router basename='/games' >
        <Switch>
          <Route path={`${process.env.PUBLIC_URL}/lindsay-granger`} component={ Granger } />
          <Route path="*" component={ Granger } />
        </Switch>
      </Router>
    )
  }
}

export default App;
