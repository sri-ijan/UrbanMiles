import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Topbar from '../../components/owner/Topbar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const { isOwner , navigate } = useAppContext()

  useEffect(()=> {
    if(!isOwner){
      navigate('/')
    }
  },[isOwner])
  return (
    <div className='flex flex-col bg-gradient-to-r from-black to-gray-900 min-h-screen text-white'>
        <Navbar/>
        {/* <div className='flex flex-col'>
            
        </div> */}
        <Topbar/>
        <Outlet/>
    </div>
  )
}

export default Layout