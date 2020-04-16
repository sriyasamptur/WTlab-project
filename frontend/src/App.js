import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import "./App.css";
import NavBar2 from './components/NavBar2'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import Popular from './components/Popular'
import AllMovies from './components/AllMovies'
import Search from './components/Search'

function App() {
  return (
    <Router>
      <div className="App" >
        <NavBar2 />
        <div className="container">
          <Route exact path="/register" component={Register} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/profile" component={Profile} />
        </div>
      </div>
      <Route exact path="/" component={Popular} />
      <Route exact path="/browse" component={AllMovies} />
    </Router>
  );
}

export default App;