import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import DispatchContext from '../contexts/DispatchContext'
import StateContext from '../contexts/StateContext'

const HeaderLoggedIn = () => {
  const { user } = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  const handleLogout = () => {
    dispatch({ type: 'logout' })
  }

  const handleSearch = () => {
    dispatch({ type: 'openSearch' })
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <span
        onClick={handleSearch}
        className="text-white mr-2 header-search-icon"
      >
        <i className="fas fa-search"></i>
      </span>
      {'  '}
      <span
        onClick={() => dispatch({ type: 'toggleChat' })}
        className="mr-2 header-chat-icon text-white"
      >
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      {'  '}
      <Link to={`/profile/${user.username}`} className="mr-2">
        <img
          alt="user's profile pic"
          className="small-header-avatar"
          src={user.avatar}
        />
      </Link>
      {'  '}
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      {'  '}
      <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  )
}

export default HeaderLoggedIn
