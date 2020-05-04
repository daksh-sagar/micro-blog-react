import React, { useEffect, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Page from './Page'
import StateContext from '../contexts/StateContext'
import ProfilePosts from './ProfilePosts'

const Profile = () => {
  const { user } = useContext(StateContext)
  const { username } = useParams()

  const [profileData, setProfileData] = useState({
    profileUsername: '...',
    profileAvatar: 'https://gravatar.com/avatar/placeholder?s=128',
    isFollowing: false,
    counts: { postCount: '', followerCount: '', followingCount: '' },
  })

  useEffect(() => {
    const request = axios.CancelToken.source()
    async function fetchData() {
      try {
        const response = await axios.post(
          `/profile/${username}`,
          {
            token: user.token,
          },
          { cancelToken: request.token }
        )
        setProfileData(response.data)
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    }
    fetchData()

    return () => {
      request.cancel()
    }
  }, [])

  return (
    <Page title="Profile">
      <h2>
        <img
          className="avatar-small"
          src={profileData.profileAvatar}
          alt="profile pic"
        />{' '}
        {profileData.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="/" className="active nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </a>
        <a href="/" className="nav-item nav-link">
          Followers: {profileData.counts.followerCount}
        </a>
        <a href="/" className="nav-item nav-link">
          Following: {profileData.counts.followingCount}
        </a>
      </div>

      <ProfilePosts />
    </Page>
  )
}

export default Profile
