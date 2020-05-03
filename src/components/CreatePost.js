import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import Page from './Page'

const CreatePost = ({ addFlashMessage }) => {
  const [title, setTitle] = useState()
  const [body, setBody] = useState()
  const [wasSuccessful, setWasSuccessful] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/create-post', {
        title,
        body,
        token: localStorage.getItem('token'),
      })
      setWasSuccessful(response.data)
    } catch (error) {
      console.log(JSON.stringify(error))
    }
  }

  if (wasSuccessful) {
    addFlashMessage('Congrats, the new post was created.')
    return <Redirect to={`/post/${wasSuccessful}`} />
  }

  return (
    <Page title="Create Post">
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
            onChange={(e) => setTitle(e.target.value)}
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
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  )
}

export default CreatePost
