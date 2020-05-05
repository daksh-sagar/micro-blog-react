import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link, Redirect } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import ReactTooltip from 'react-tooltip'
import StateContext from '../contexts/StateContext'
import Page from './Page'
import NotFound from './NotFound'

const SinglePost = () => {
  const { loggedIn, user } = useContext(StateContext)
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()
  const [deleteAttemptCount, setDeleteAttemptCount] = useState(0)
  const [deleteWasSuccesful, setDeleteWasSuccessful] = useState(false)

  useEffect(() => {
    const request = axios.CancelToken.source()
    async function fetchPost() {
      try {
        const response = await axios.get(`/post/${id}`, {
          cancelToken: request.token,
        })
        setPost(response.data)
      } catch (error) {
        console.log(JSON.stringify(error))
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()

    return () => {
      request.cancel()
    }
  }, [])

  useEffect(() => {
    if (deleteAttemptCount) {
      const request = axios.CancelToken.source()
      async function deletePost() {
        try {
          const response = await axios.delete(
            `/post/${id}`,
            {
              data: { token: user.token },
            },
            {
              cancelToken: request.token,
            }
          )
          if (response.data === 'Success') {
            setDeleteWasSuccessful(true)
          }
        } catch (error) {
          console.log(JSON.stringify(error))
        }
      }

      deletePost()

      return () => {
        request.cancel()
      }
    }
  }, [deleteAttemptCount])

  const isOwner = () => {
    if (loggedIn) {
      return user.username === post.author.username
    }
    return false
  }

  const handleDelete = () => {
    const areYouSure = window.confirm(
      'Are you sure you want to delete this post?'
    )
    if (areYouSure) {
      setDeleteAttemptCount((prev) => prev + 1)
    }
  }

  if (deleteWasSuccesful) {
    return <Redirect to={`/profile/${user.username}`} />
  }

  if (isLoading) {
    return <Page title="Loading...">Loading...</Page>
  }

  if (!isLoading && !post) {
    return <NotFound />
  }

  const date = new Date(post.createdDate)
  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{' '}
            <button
              data-tip="Delete"
              data-for="delete"
              className="delete-post-button text-danger"
              onClick={handleDelete}
            >
              <i className="fas fa-trash"></i>
            </button>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img
            alt="users profile pic"
            className="avatar-tiny"
            src={post.author.avatar}
          />
        </Link>
        Posted by{' '}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{' '}
        on {formattedDate}
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} />
      </div>
    </Page>
  )
}

export default SinglePost
