import React, { useEffect } from 'react'
import Container from './Container'

const Page = ({ title, wide, children }) => {
  useEffect(() => {
    document.title = `${title} | MicroBlog`
    window.scrollTo(0, 0)
  }, [title])
  return <Container wide={wide}>{children}</Container>
}

export default Page
