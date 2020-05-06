import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const ProfileFollowers = () => {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [followers, setFollowers] = useState([])

  useEffect(() => {
    const request = axios.CancelToken.source()
    async function fetchFollowers() {
      try {
        const response = await axios.get(`/profile/${username}/followers`, {
          cancelToken: request.token,
        })
        setFollowers(response.data)
      } catch (error) {
        console.log(JSON.stringify(error))
      } finally {
        setIsLoading(false)
      }
    }

    fetchFollowers()

    return () => {
      request.cancel()
    }
  }, [username])

  return isLoading ? (
    <>Loading...</>
  ) : followers.length > 0 ? (
    <div className="list-group">
      {followers.map((follower) => {
        return (
          <Link
            key={follower.username}
            to={`/profile/${follower.username}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={follower.avatar} alt="avatar" />{' '}
            {follower.username}
          </Link>
        )
      })}
    </div>
  ) : (
    <>
      <h2>No one is following this account yet</h2>
    </>
  )
}

export default ProfileFollowers
