import React, { useState, useEffect, Suspense, lazy } from 'react'
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
import Profile from './components/Profile'
import EditPost from './components/EditPost'
import NotFound from './components/NotFound'
import Search from './components/Search'
const Chat = lazy(() => import('./components/Chat'))

axios.defaults.baseURL = 'http://localhost:8080'

const App = () => {
  const [isLoading, setIsLoading] = useState(true)

  const initialState = {
    loggedIn: Boolean(localStorage.getItem('token')),
    flashMessages: [],
    user: {
      token: localStorage.getItem('token'),
      username: localStorage.getItem('username'),
      avatar: localStorage.getItem('avatar'),
    },
    isSearchOpen: false,
    isChatOpen: false,
  }

  const reducer = (draft, action) => {
    switch (action.type) {
      case 'login':
        draft.loggedIn = true
        draft.user = action.data
        return
      case 'logout':
        draft.loggedIn = false
        return
      case 'flashMessage':
        draft.flashMessages.push(action.data)
        return
      case 'openSearch':
        draft.isSearchOpen = true
        return
      case 'closeSearch':
        draft.isSearchOpen = false
        return
      case 'toggleChat':
        draft.isChatOpen = !draft.isChatOpen
        return
      case 'closeChat':
        draft.isChatOpen = false
        return
      default:
        return
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem('token', state.user.token)
      localStorage.setItem('username', state.user.username)
      localStorage.setItem('avatar', state.user.avatar)
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('avatar')
    }
  }, [state.loggedIn])

  useEffect(() => {
    if (state.loggedIn) {
      const request = axios.CancelToken.source()
      async function checkToken() {
        try {
          const response = await axios.post(
            '/checkToken',
            { token: state.user.token },
            {
              cancelToken: request.token,
            }
          )

          if (!response.data) {
            dispatch({ type: 'logout' })
          }
        } catch (error) {
          console.log(JSON.stringify(error))
        } finally {
          setIsLoading(false)
        }
      }

      checkToken()
      return () => request.cancel()
    } else {
      setIsLoading(false)
    }
  }, [])

  return isLoading ? (
    <>Loading App...</>
  ) : (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Switch>
            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/post/:id" exact>
              <SinglePost />
            </Route>
            <Route path="/post/:id/edit" exact>
              <EditPost />
            </Route>
            <Route path="/profile/:username">
              <Profile />
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
            <Route>
              <NotFound />
            </Route>
          </Switch>
          {state.isSearchOpen && <Search />}
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
          <Footer />
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
