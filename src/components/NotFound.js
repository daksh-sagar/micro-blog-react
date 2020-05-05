import React from 'react'
import Page from './Page'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <Page title="404 Not Found">
      <div className="text-center">
        <h2>Whoops, the page you requested does not exist</h2>
        <p className="lead text-muted">
          Go back to the <Link to="/">Homepage</Link>
        </p>
      </div>
    </Page>
  )
}

export default NotFound
