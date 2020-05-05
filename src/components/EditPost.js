import React, { useEffect, useContext } from 'react'
import { useImmerReducer } from 'use-immer'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import StateContext from '../contexts/StateContext'
import DispatchContext from '../contexts/DispatchContext'
import Page from './Page'

const EditPost = () => {
  const appDispatch = useContext(DispatchContext)
  const { user } = useContext(StateContext)
  const reducer = (draft, action) => {
    switch (action.type) {
      case 'fetchComplete':
        draft.title.value = action.data.title
        draft.body.value = action.data.body
        return
      case 'titleChange':
        draft.title.value = action.data
        return
      case 'bodyChange':
        draft.body.value = action.data
        return
      case 'setFetchingFalse':
        draft.isFetching = false
        return
      case 'submit':
        draft.sendCount += 1
        return
      case 'updateRequestStarted':
        draft.isSaving = true
        return
      case 'updateRequestFinished':
        draft.isSaving = false
        return
      default:
        break
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, {
    title: {
      value: '',
      hasErrors: false,
      message: '',
    },
    body: {
      value: '',
      hasErrors: false,
      message: '',
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch({ type: 'submit' })
  }

  useEffect(() => {
    const request = axios.CancelToken.source()
    async function fetchPost() {
      try {
        const response = await axios.get(`/post/${state.id}`, {
          cancelToken: request.token,
        })
        dispatch({ type: 'fetchComplete', data: response.data })
      } catch (error) {
        console.log(JSON.stringify(error))
      } finally {
        dispatch({ type: 'setFetchingFalse' })
      }
    }

    fetchPost()

    return () => {
      request.cancel()
    }
  }, [])

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: 'updateRequestStarted' })
      const request = axios.CancelToken.source()
      async function fetchPost() {
        try {
          await axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: user.token,
            },
            {
              cancelToken: request.token,
            }
          )

          appDispatch({ type: 'flashMessage', data: 'Post was updated' })
        } catch (error) {
          console.log(JSON.stringify(error))
        } finally {
          dispatch({ type: 'updateRequestFinished' })
        }
      }

      fetchPost()

      return () => {
        request.cancel()
      }
    }
  }, [state.sendCount])

  return state.isFetching ? (
    <Page title="Loading...">Loading...</Page>
  ) : (
    <Page title="Edit Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            value={state.title.value}
            onChange={(e) =>
              dispatch({ type: 'titleChange', data: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={state.body.value}
            onChange={(e) =>
              dispatch({ type: 'bodyChange', data: e.target.value })
            }
          />
        </div>

        <button disabled={state.isSaving} className="btn btn-primary">
          Save Updates
        </button>
      </form>
    </Page>
  )
}

export default EditPost
