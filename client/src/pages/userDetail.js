import React from 'react'
import { useLocation } from 'react-router-dom'

const UserDetail = () => {
    const location = useLocation()
    console.log(location.state)

  return (
    <div>UserDetail</div>
  )
}

export default UserDetail