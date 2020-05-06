import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const ProfileFollowing = () => {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [following, setFollowing] = useState([])

  useEffect(() => {
    const request = axios.CancelToken.source()
    async function fetchFollowing() {
      try {
        const response = await axios.get(`/profile/${username}/following`, {
          cancelToken: request.token,
        })
        setFollowing(response.data)
      } catch (error) {
        console.log(JSON.stringify(error))
      } finally {
        setIsLoading(false)
      }
    }

    fetchFollowing()

    return () => {
      request.cancel()
    }
  }, [username])

  return isLoading ? (
    <>Loading...</>
  ) : following.length > 0 ? (
    <div className="list-group">
      {following.map((follower) => {
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
      <h2>Not following anyone</h2>
    </>
  )
}

export default ProfileFollowing
