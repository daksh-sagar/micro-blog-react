import React, { useContext, useCallback, useEffect } from 'react'
import { useImmer } from 'use-immer'
import axios from 'axios'
import { Link } from 'react-router-dom'
import DispatchContext from '../contexts/DispatchContext'

const Search = () => {
  const dispatch = useContext(DispatchContext)

  const [state, setState] = useImmer({
    searchTerm: '',
    results: [],
    show: 'neither',
    requestCount: 0,
  })

  const handleInput = (e) => {
    const value = e.target.value
    setState((draft) => {
      draft.searchTerm = value
    })
  }

  const searchKeyPressHandler = useCallback(
    (e) => {
      if (e.keyCode === 27) {
        dispatch({ type: 'closeSearch' })
      }
    },
    [dispatch]
  )

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState((draft) => {
        draft.show = 'loading'
      })
      const delay = setTimeout(() => {
        setState((draft) => {
          draft.requestCount += 1
        })
      }, 1000)

      return () => clearTimeout(delay)
    } else {
      setState((draft) => {
        draft.show = 'neither'
      })
    }
  }, [state.searchTerm, setState])

  useEffect(() => {
    if (state.requestCount) {
      const request = axios.CancelToken.source()

      async function fetchResults() {
        try {
          const response = await axios.post(
            '/search',
            { searchTerm: state.searchTerm },
            {
              cancelToken: request.token,
            }
          )
          setState((draft) => {
            draft.results = response.data
            draft.show = 'results'
          })
        } catch (error) {
          console.log(JSON.stringify(error))
        }
      }

      fetchResults()

      return () => request.cancel()
    }
  }, [state.requestCount])

  useEffect(() => {
    document.addEventListener('keyup', searchKeyPressHandler)
    return () => {
      document.removeEventListener('keyup', searchKeyPressHandler)
    }
  }, [searchKeyPressHandler])

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
            onChange={handleInput}
          />
          <span
            onClick={() => dispatch({ type: 'closeSearch' })}
            className="close-live-search"
          >
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div
            className={
              'circle-loader ' +
              (state.show === 'loading' ? 'circle-loader--visible' : '')
            }
          ></div>
          <div
            className={
              'live-search-results ' +
              (state.show === 'results' ? 'live-search-results--visible' : '')
            }
          >
            <div className="list-group shadow-sm">
              <div className="list-group-item active">
                <strong>Search Results</strong> {state.results.length} items
                found
              </div>
              {state.results.map((post) => {
                const date = new Date(post.createdDate)
                const formattedDate = `${date.getDate()}/${
                  date.getMonth() + 1
                }/${date.getFullYear()}`
                return (
                  <Link
                    key={post._id}
                    to={`/post/${post._id}`}
                    className="list-group-item list-group-item-action"
                    onClick={() => dispatch({ type: 'closeSearch' })}
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
