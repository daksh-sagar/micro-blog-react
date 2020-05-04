import React from 'react'
import { useImmerReducer } from 'use-immer'
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
import DispatchContext from './contexts/DispatchContext'
import StateContext from './contexts/StateContext'

axios.defaults.baseURL = 'http://localhost:8080'

const App = () => {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem('token')),
    flashMessages: [],
  }

  const reducer = (draft, action) => {
    switch (action.type) {
      case 'login':
        draft.loggedIn = true
        return
      case 'logout':
        draft.loggedIn = false
        return
      case 'flashMessage':
        draft.flashMessages.push(action.value)
        return
      default:
        return
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Switch>
            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
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
              <CreatePost />
            </Route>
          </Switch>
          <Footer />
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
