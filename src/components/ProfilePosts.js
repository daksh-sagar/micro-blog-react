import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const ProfilePosts = () => {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const request = axios.CancelToken.source()
    async function fetchPosts() {
      try {
        const response = await axios.get(`/profile/${username}/posts`, {
          cancelToken: request.token,
        })
        setPosts(response.data)
      } catch (error) {
        console.log(JSON.stringify(error))
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()

    return () => {
      request.cancel()
    }
  }, [username])

  return isLoading ? (
    <>Loading...</>
  ) : posts.length > 0 ? (
    <div className="list-group">
      {posts.map((post) => {
        const date = new Date(post.createdDate)
        const formattedDate = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`
        return (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="list-group-item list-group-item-action"
          >
            <img
              className="avatar-tiny"
              src={post.author.avatar}
              alt="avatar"
            />{' '}
            <strong>{post.title}</strong>
            <span className="text-muted small"> on {formattedDate} </span>
          </Link>
        )
      })}
    </div>
  ) : (
    <>
      <h2>No posts here !</h2>
    </>
  )
}

export default ProfilePosts
