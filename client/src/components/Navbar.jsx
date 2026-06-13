import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { assets, menuLinks } from '../assets/assets'
import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const Navbar = () => {

  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext()

  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const changeRole = async () => {
    try {
      const { data } = await axios.post('/api/owner/change-role')
      if (data.success) {
        setIsOwner(true)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const handleClickListYouCar = () => {
  if (!user) {
    setShowLogin(true);
    toast.error("Please login to list your car");
  } else if (user && isOwner) {
    navigate('/owner');
  } else {
    changeRole();
  }
};

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b relative transition-all 
      bg-black text-[#F5F5F5] border-[#333]`}>

      <div className="flex items-center gap-4">
        <Link to='/'>
          <motion.img whileHover={{ scale: 1.05 }} src={assets.logo} alt="logo" className='h-8 border border-red-500 rounded' />
        </Link>
        {user && (
          <span className="text-m text-[#D4AF37] hidden sm:inline">Welcome, {user.name}!</span>
        )}
      </div>

      <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-[#333] right-0 flex flex-col sm:flex-row
        items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-10 
        bg-black text-[#F5F5F5] 
        ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>

        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path} className='hover:text-[#D4AF37] transition-all'>
            {link.name}
          </Link>
        ))}

        <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
          <button onClick={() => {
                if (user) {
                  navigate('/my-bookings');
                } else {
                  setShowLogin(true);
                  toast.error("Please login to view your bookings");
                }
              }
            }

            className='cursor-pointer hover:text-[#D4AF37] transition-all'>
            My Bookings
          </button>
          <button
            onClick={handleClickListYouCar}
            className='cursor-pointer hover:text-[#D4AF37] transition-all'>
            {isOwner ? 'Dashboard' : 'List cars'}
          </button>
          
          <button
            onClick={() => { user ? logout() : setShowLogin(true) }}
            className='cursor-pointer px-8 py-2 bg-[#D4AF37] hover:bg-[#C9A033] transition-all text-black font-medium rounded-lg'>
            {user ? `Logout` : 'Login'}
          </button>
        </div>
      </div>

      <button className='sm:hidden cursor-pointer' aria-label='Menu' onClick={() => setOpen(!open)}>
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>

    </motion.div>

  )
}

export default Navbar
