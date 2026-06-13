// import React, { useState } from 'react'
// import { assets, ownerMenuLinks } from '../../assets/assets'
// import { NavLink, useLocation } from 'react-router-dom';
// import { useAppContext } from '../../context/AppContext';
// import toast from 'react-hot-toast';

// const Topbar = () => {

//     const {user , axios, fetchUser } = useAppContext();
//     const location  = useLocation();
//     const [image, setImage] = useState('');
  
//     const updateImage = async()=>{
//         try {
//            const formData = new FormData();
//            formData.append('image', image)

//            const {data} = await axios.post('/api/owner/update-image',formData)

//            if(data.success){
//              fetchUser()
//              toast.success(data.message);
//              setImage('')
//            } else{
//             toast.error(data.message)
//            }
//         } catch (error) {
//           toast.error(error.message)
//         }
//     }

//   return ( 
//     <div className='relative min-h-screen md:flex flex-row items-center pt-8 max-w-13 md:max-w-60
//     w-full border-r border-borderColor text-sm'>

//         {/* <div className='group relative'>
//             <label htmlFor="image">
//                 <img src={image ? URL.createObjectURL(image) : user?.image || "assets.dummy_user" } alt="" 
//                 className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto'/>
//                 <input type="file" id='image' accept='image/*' hidden onChange={e => setImage(e.target.files[0])}/>

//                  <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer'>
//                     <img src={assets.edit_icon} alt="" />
//                  </div>
//             </label>
//         </div>

//         {image && (
//             <button onClick={updateImage} className='absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer'> Save <img src={assets.check_icon} width={13} alt="" 
//              /> </button>
//         )}

//         <p className='text-white mt-2 text-base max-md:hidden'>{user?.name}</p> */}

//         <div className='w-full flex'>
//            {ownerMenuLinks.map((link,index)=>(
//              <NavLink key={index} to={link.path} className={`relative flex  items-center gap-2 w-full py-3 pl-4 first:mt-6 ${link.path === location.pathname ? 'bg-primary/10 text-primary' : 'text-white'} `}>
//                 <img src={link.path === location.pathname ? link.coloredIcon : link.icon} alt="car icon" />
//                 <span className='max-md:hidden'> {link.name}</span>
//                 <div className={`${link.path === location.pathname && 'bg-primary'} 
//                     w-1.5 h-8 rounded-l right-0 absolute`}>  </div>
//              </NavLink>
//            ))}
//         </div>
        
//     </div>
//   )
// }

// export default Topbar



import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Topbar = () => {

    const { user, axios, fetchUser } = useAppContext();
    const location = useLocation();
    const [image, setImage] = useState('');

    const updateImage = async () => {
        try {
            const formData = new FormData();
            formData.append('image', image)

            const { data } = await axios.post('/api/owner/update-image', formData)

            if (data.success) {
                fetchUser()
                toast.success(data.message);
                setImage('')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
  <div className="w-full flex flex-col items-center justify-start py-8">

    <div className="flex gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-full shadow-lg">
      {ownerMenuLinks.map((link, index) => (
  <NavLink
    key={index}
    to={link.path}
    end={link.path === "/owner"} 
    className={({ isActive }) =>
      `flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 
       ${isActive ? 'bg-yellow-400 text-black shadow-md' : 'bg-white/20 text-white hover:bg-yellow-300 hover:text-black'}`
    }
  >
    <img
      src={link.path === location.pathname ? link.coloredIcon : link.icon}
      alt={link.name}
      className="w-5 h-5"
    />
    <span className="hidden md:inline">{link.name}</span>
  </NavLink>
))}

    </div>

    {/* Placeholder for below section */}
    <div className="items-centre mt-10 w-full max-w-4xl px-4">
      {/* Your below-section content here */}
    </div>

  </div>
);

}

export default Topbar
