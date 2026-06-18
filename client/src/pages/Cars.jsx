import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Cars = () => {

  const [searchParams] = useSearchParams()

  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')

  const {cars, axios} = useAppContext();

  const isSearchData = pickupLocation && pickupDate && returnDate 
  const [filteredCars, setFilteredCars] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const applyFilter = async() =>{
     if(input === ''){
       setFilteredCars(cars)
       return null;
     }

     const filtered = cars.slice().filter((car) =>{
        return car.brand.toLowerCase().includes(input.toLowerCase())
        || car.model.toLowerCase().includes(input.toLowerCase())
        || car.category.toLowerCase().includes(input.toLowerCase())
        || car.transmission.toLowerCase().includes(input.toLowerCase())
        || car.fuel_type.toLowerCase().includes(input.toLowerCase())
        || car.location.toLowerCase().includes(input.toLowerCase())
     })
     setFilteredCars(filtered)
  }

  const searchCarAvailability = async() =>{
    setIsLoading(true)
    try {
      const {data} = await axios.post('/api/bookings/check-availability',
        {location : pickupLocation, pickupDate, returnDate})
      if(data.success){
        setFilteredCars(data.availableCars)
        if(data.availableCars.length === 0){
          toast('No cars available for the selected dates and location')
        }
      }
    } catch(error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    isSearchData && searchCarAvailability()
  },[])

  useEffect(()=>{
    cars.length > 0 && !isSearchData && applyFilter()
  },[input, cars])
  
  return (
    <div>

      <div className='flex flex-col items-center py-20 bg-none max-md:px-4'>
        <Title title='Available Cars' subTitle='Browse our selection of premium vehicles available for your next adventure' />

        <div className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2'/>
          <input onChange={(e)=> setInput(e.target.value)} value={input} type="text" placeholder='Search by make, model or features'
            className='w-full h-full outline-none text-gray-500' />
          <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2'/>
        </div>
      </div>

      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10 pb-20'>

        {isLoading ? (
          <div className='flex justify-center items-center py-24'>
            <div className='w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin'></div>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <img src={assets.car_icon} alt="" className='h-16 opacity-30 mb-4'/>
            <p className='text-white text-lg font-medium'>No cars found</p>
            <p className='text-gray-400 text-sm mt-1'>
              {input
                ? `No results for "${input}" — try a different search term`
                : 'No cars available for the selected criteria'}
            </p>
            {input && (
              <button
                onClick={() => setInput('')}
                className='mt-4 px-5 py-2 text-sm bg-[#D4AF37] text-black rounded-lg font-medium hover:bg-[#C9A033] transition-all'
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <p className='text-gray-400 xl:px-20 max-w-7xl mx-auto'>
              Showing {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'}
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
              {filteredCars.map((car, index) =>(
                <div key={index}>
                  <CarCard car={car}/>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

    </div>
  )
}

export default Cars