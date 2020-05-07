import React, { useEffect, useContext } from 'react'
import { useImmerReducer } from 'use-immer'
import axios from 'axios'
import { CSSTransition } from 'react-transition-group'
import DispatchContext from '../contexts/DispatchContext'
import Page from './Page'

const HomeGuest = () => {
  const appDispatch = useContext(DispatchContext)

  const initialState = {
    username: {
      value: '',
      hasErrors: false,
      message: '',
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: '',
      hasErrors: false,
      message: '',
      isUnique: false,
      checkCount: 0,
    },
    password: {
      value: '',
      hasErrors: false,
      message: '',
    },
    submitCount: 0,
  }

  const reducer = (draft, action) => {
    switch (action.type) {
      case 'usernameImmediately':
        draft.username.hasErrors = false
        draft.username.value = action.data
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true
          draft.username.message = 'Username can not be more than 30 characters'
        } else if (
          draft.username.value &&
          !/^([a-zA-Z0-9]+)$/.test(draft.username.value)
        ) {
          draft.username.hasErrors = true
          draft.username.message =
            'Username can only contain letters and numbers'
        }
        return
      case 'usernameAfterDelay':
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true
          draft.username.message = 'Username must contain atleast 3 characters'
        } else if (!draft.username.hasErrors && !action.noRequest) {
          draft.username.checkCount += 1
        }
        return
      case 'usernameUniqueResults':
        if (action.data) {
          draft.username.hasErrors = true
          draft.username.isUnique = false
          draft.username.message = 'Username already taken, try something else'
        } else {
          draft.username.isUnique = true
        }
        return
      case 'emailImmediately':
        draft.email.hasErrors = false
        draft.email.value = action.data
        return
      case 'emailAfterDelay':
        if (
          !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
            draft.email.value
          )
        ) {
          draft.email.hasErrors = true
          draft.email.message = 'Invalid email address'
        } else if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount += 1
        }
        return
      case 'emailUniqueResults':
        if (action.data) {
          draft.email.hasErrors = true
          draft.email.isUnique = false
          draft.email.message = 'Email address already in use'
        } else {
          draft.email.isUnique = true
        }
        return
      case 'passwordImmediately':
        draft.password.hasErrors = false
        draft.password.value = action.data
        if (draft.password.value.length > 32) {
          draft.password.hasErrors = true
          draft.password.message = 'Password can not exceed 32 characters'
        }
        return
      case 'passwordAfterDelay':
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true
          draft.password.message = 'Password must contain atleast 12 characters'
        }
        return
      case 'submitForm':
        if (
          !draft.username.hasErrors &&
          draft.username.isUnique &&
          !draft.email.hasErrors &&
          draft.email.isUnique &&
          !draft.password.hasErrors
        ) {
          draft.submitCount += 1
        }
        return
      default:
        return
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState)

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(
        () => dispatch({ type: 'usernameAfterDelay' }),
        1000
      )

      return () => clearTimeout(delay)
    }
  }, [state.username.value])

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(
        () => dispatch({ type: 'emailAfterDelay' }),
        1000
      )
      return () => clearTimeout(delay)
    }
  }, [state.email.value])

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(
        () => dispatch({ type: 'passwordAfterDelay' }),
        1000
      )
      return () => clearTimeout(delay)
    }
  }, [state.password.value])

  useEffect(() => {
    if (state.username.checkCount) {
      const request = axios.CancelToken.source()
      async function check() {
        try {
          const response = await axios.post(
            '/doesUsernameExist',
            { username: state.username.value },
            { cancelToken: request.token }
          )
          dispatch({ type: 'usernameUniqueResults', data: response.data })
        } catch (error) {
          console.log(JSON.stringify(error))
        }
      }

      check()

      return () => request.cancel()
    }
  }, [state.username.checkCount])

  useEffect(() => {
    if (state.email.checkCount) {
      const request = axios.CancelToken.source()
      async function check() {
        try {
          const response = await axios.post(
            '/doesEmailExist',
            { email: state.email.value },
            { cancelToken: request.token }
          )
          dispatch({ type: 'emailUniqueResults', data: response.data })
        } catch (error) {
          console.log(JSON.stringify(error))
        }
      }

      check()

      return () => request.cancel()
    }
  }, [state.email.checkCount])

  useEffect(() => {
    if (state.submitCount) {
      const request = axios.CancelToken.source()
      async function register() {
        try {
          const response = await axios.post(
            '/register',
            {
              username: state.username.value,
              email: state.email.value,
              password: state.password.value,
            },
            { cancelToken: request.token }
          )
          appDispatch({ type: 'login', data: response.data })
          appDispatch({
            type: 'flashMessage',
            data: 'Congrats ! Signup successful',
          })
        } catch (error) {
          console.log(JSON.stringify(error))
        }
      }

      register()

      return () => request.cancel()
    }
  }, [state.submitCount])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch({ type: 'usernameImmediately', data: state.username.value })
    dispatch({ type: 'usernameAfterDelay', noRequest: true })
    dispatch({ type: 'emailImmediately', data: state.email.value })
    dispatch({ type: 'emailAfterDelay', noRequest: true })
    dispatch({ type: 'passwordImmediately', data: state.password.value })
    dispatch({ type: 'passwordAfterDelay' })
    dispatch({ type: 'submitForm' })
  }

  return (
    <Page wide title="Home">
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">
            Are you sick of short tweets and impersonal &ldquo;shared&rdquo;
            posts that are reminiscent of the late 90&rsquo;s email forwards? We
            believe getting back to actually writing is the key to enjoying the
            internet again.
          </p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
                onChange={(e) =>
                  dispatch({
                    type: 'usernameImmediately',
                    data: e.target.value,
                  })
                }
              />
              <CSSTransition
                in={state.username.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.username.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input
                id="email-register"
                name="email"
                className="form-control"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
                onChange={(e) =>
                  dispatch({
                    type: 'emailImmediately',
                    data: e.target.value,
                  })
                }
              />
              <CSSTransition
                in={state.email.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.email.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Create a password"
                onChange={(e) =>
                  dispatch({
                    type: 'passwordImmediately',
                    data: e.target.value,
                  })
                }
              />
              <CSSTransition
                in={state.password.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.password.message}
                </div>
              </CSSTransition>
            </div>
            <button
              type="submit"
              className="py-3 mt-4 btn btn-lg btn-success btn-block"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </Page>
  )
}

export default HomeGuest
