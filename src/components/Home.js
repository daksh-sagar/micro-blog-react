import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useImmer } from 'use-immer'
import axios from 'axios'
import Page from './Page'
import StateContext from '../contexts/StateContext'

const Home = () => {
  const { user } = useContext(StateContext)
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  })

  useEffect(() => {
    const request = axios.CancelToken.source()

    async function fetchFeed() {
      try {
        const response = await axios.post(
          `/getHomeFeed`,
          { token: user.token },
          {
            cancelToken: request.token,
          }
        )
        setState((draft) => {
          draft.isLoading = false
          draft.feed = response.data
        })
      } catch (error) {
        console.log(JSON.stringify(error))
      }
    }

    fetchFeed()

    return () => {
      request.cancel()
    }
  }, [])

  return state.isLoading ? (
    <>Loading Feed...</>
  ) : (
    <Page title="Your Feed">
      {state.feed.length === 0 ? (
        <>
          <h2 className="text-center">
            Hello <strong>{user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow, you can use the
            &ldquo;Search&rdquo; feature in the top menu bar to find content
            written by people with similar interests and then follow them.
          </p>
        </>
      ) : (
        <>
          <h2>Latest From Those You Follow</h2>
          <div className="list-group">
            {state.feed.map((post) => {
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
                  <span className="text-muted small">
                    {'  '}by {post.author.username} on {formattedDate}{' '}
                  </span>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </Page>
  )
}

export default Home
