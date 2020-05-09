import React, { useContext, useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import io from 'socket.io-client'
import DispatchContext from '../contexts/DispatchContext'
import StateContext from '../contexts/StateContext'
import { Link } from 'react-router-dom'

const socket = io('http://localhost:8080')

const Chat = () => {
  const chatField = useRef(null)
  const chatLog = useRef(null)
  const appDispatch = useContext(DispatchContext)
  const { isChatOpen, user } = useContext(StateContext)

  const [state, setState] = useImmer({
    fieldValue: '',
    chatMessages: [],
  })

  const handleFieldChange = (e) => {
    const value = e.target.value
    setState((draft) => {
      draft.fieldValue = value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    socket.emit('chatFromBrowser', {
      message: state.fieldValue,
      token: user.token,
    })

    setState((draft) => {
      draft.chatMessages.push({
        message: draft.fieldValue,
        username: user.username,
        avatar: user.avatar,
      })
      draft.fieldValue = ''
    })
  }

  useEffect(() => {
    if (isChatOpen) {
      chatField.current.focus()
    }
  }, [isChatOpen])

  useEffect(() => {
    socket.on('chatFromServer', (message) => {
      setState((draft) => {
        draft.chatMessages.push(message)
      })
    })
  }, [])

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight
  }, [state.chatMessages])

  return (
    <div
      id="chat-wrapper"
      className={
        'chat-wrapper shadow border-top border-left border-right ' +
        (isChatOpen ? 'chat-wrapper--is-visible' : '')
      }
    >
      <div className="chat-title-bar bg-primary">
        Chat
        <span
          onClick={() => appDispatch({ type: 'closeChat' })}
          className="chat-title-bar-close"
        >
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((message, index) => {
          if (message.username === user.username) {
            return (
              <div className="chat-self" key={index}>
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img
                  className="chat-avatar avatar-tiny"
                  src={message.avatar}
                  alt="profile avatar"
                />
              </div>
            )
          }

          return (
            <div className="chat-other" key={index}>
              <Link to={`/profile/${message.username}`}>
                <img
                  className="avatar-tiny"
                  src={message.avatar}
                  alt="profile avatar"
                />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                    <strong>{message.username}: </strong>
                  </Link>
                  {message.message}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <form
        id="chatForm"
        className="chat-form border-top"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
          ref={chatField}
          value={state.fieldValue}
          onChange={handleFieldChange}
        />
      </form>
    </div>
  )
}

export default Chat
