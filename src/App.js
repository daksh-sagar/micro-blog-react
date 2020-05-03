import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import axios from 'axios'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeGuest from './components/HomeGuest'
import About from './components/About'
import Terms from './components/Terms'
import Home from './components/Home'
import CreatePost from './components/CreatePost'
import SinglePost from './components/SinglePost'
import FlashMessages from './components/FlashMessages'

axios.defaults.baseURL = 'http://localhost:8080'

const App = () => {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem('token'))
  )
  const [flashMessages, setFlashMessages] = useState([])

  const addFlashMessage = (msg) => {
    setFlashMessages((prev) => [...prev, msg])
  }

  return (
    <Router>
      <FlashMessages messages={flashMessages} />
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Switch>
        <Route path="/" exact>
          {loggedIn ? <Home /> : <HomeGuest />}
        </Route>
        <Route path="/post/:id">
          <SinglePost />
        </Route>
        <Route path="/about-us">
          <About />
        </Route>
        <Route path="/terms">
          <Terms />
        </Route>
        <Route path="/create-post">
          <CreatePost addFlashMessage={addFlashMessage} />
        </Route>
      </Switch>
      <Footer />
    </Router>
  )
}

export default App
