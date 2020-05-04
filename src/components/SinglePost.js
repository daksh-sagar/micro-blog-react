import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Page from './Page'

const SinglePost = () => {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()

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

  if (isLoading) {
    return <Page title="Loading...">Loading...</Page>
  }

  const date = new Date(post.createdDate)
  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <a href="#" className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </a>
          <a className="delete-post-button text-danger" title="Delete">
            <i className="fas fa-trash"></i>
          </a>
        </span>
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

      <div className="body-content">{post.body}</div>
    </Page>
  )
}

export default SinglePost
