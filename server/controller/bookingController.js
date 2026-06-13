import Booking from "../models/booking.js"
import Car from "../models/car.js";
import { BookingRequestCreated, BookingRequestAccepted, BookingRequestCancelled } from "../utils/mailObject.js";
import transporter from "../config/mail.js";
import { isCarAvailableForDates } from '../utils/bookingUtils.js'

const TestUserEmail = process.env.TEST_USER_EMAIL;

export const checkAvailability = async (req, res) => {
  try {
    const { car, pickupDate, returnDate } = req.body;

    const isAvailable = await isCarAvailableForDates(car, pickupDate, returnDate);

    return res.status(200).json({
      success: true,
      isCarAvailable: isAvailable
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const checkAvailabilityOfCar = async(req,res) =>{
    try{
        const {location,pickupDate, returnDate } = req.body;

        const cars = await Car.find({location,isAvailable:true})

        const availableCarsPromises = cars.map(async (car) =>{
            const isAvailable = await isCarAvailableForDates(car._id, pickupDate, returnDate)
            return {...car._doc, isAvailable: isAvailable}
        })

        let availableCars = await Promise.all(availableCarsPromises);
         availableCars = availableCars.filter(car=> car.isAvailable === true)
    
        res.json({ success: true, availableCars});

    } catch(error){
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const createBooking = async(req,res) =>{
    // console.log(req);    
    try{
      const {_id } = req.user;
      const {car, pickupDate,returnDate } = req.body;
        
      const isAvailable = await isCarAvailableForDates(car, pickupDate, returnDate)
      
      if(!isAvailable){
        return res.json({ success:false, message: "This car is not available for the selected dates! Please choose another car or different dates."})
      }

      const carData = await Car.findById(car).populate("owner");;
      const picked = new Date(pickupDate);
      const returned = new Date(returnDate);
      const noOfDays = Math.ceil((returned - picked) /(1000 * 60 * 60 * 24));
      const price = carData.pricePerDay * noOfDays ;

      const newBooking = await Booking.create({
            car,
            user: _id,
            owner: carData.owner._id,
            pickupDate,
            returnDate,
            price,
            status: "pending"
        });

        const booking = await Booking.findById(newBooking._id).populate("car").populate("user").populate("owner");

        const mailOptions = {
            ...BookingRequestCreated(booking),
            to: [booking.user?.email, TestUserEmail]
        };

        await transporter.sendMail(mailOptions);
        console.log("Booking request email sent to owner :", booking.owner.email);
        
        res.json({ success: true, message: "Booking Request Created" });

    } catch(error){
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const getUserBookings = async(req,res) =>{
    try{
        const {_id} = req.user;
        const bookings = await Booking.find({ user: _id }).populate("car").sort({createdAt:-1})

        res.json({success: true , bookings});

    } catch(error){
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const getOwnerBookings = async(req,res) =>{
    try{
        if(req.user.role !== 'owner'){
            return res.json({success: false, message: "Unauthorized"})
        }
        const bookings = await Booking.find({owner: req.user._id}).populate('car user').select("-user.password").sort({createdAt: -1})

        res.json({success: true, bookings})

    } catch(error){
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const changeBookingStatus = async(req,res) =>{
    try{
        const {_id} = req.user;
        const {bookingId , status} = req.body
        const booking = await Booking.findById(bookingId).populate("car").populate("user").populate("owner");;
        console.log("here: ", booking);
        

        if(booking.owner._id.toString() !== _id.toString()){
            return res.json({success: false, message: "Unauthorized"})
        }
        if(!booking){
            return res.json({success: false, message: "Booking not found"})
        }        
        booking.status = status;
        await booking.save();
        
        let mailOptions;
        if(status === "confirmed"){ 
            mailOptions = {
                ...BookingRequestAccepted(booking),
                to: [booking.user?.email, TestUserEmail]
            };
        }   
        else if(status === "cancelled"){
            mailOptions = {
                ...BookingRequestCancelled(booking),
                to: [booking.user?.email, TestUserEmail]
            };
        } 

       
        await transporter.sendMail(mailOptions);
        console.log("Booking status email sent to user :", booking.user.email);
        

        res.json({
            success: true, 
            message: "status update"
        })

    } catch(error){
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}


export const cancelBooking = async(req,res) =>{
    try{
        const {_id} = req.user;
        const {bookingId} = req.body;

        const booking = await Booking.findById(bookingId).populate("car").populate("user").populate("owner");

        if(booking.user._id.toString() !== _id.toString()){
            return res.json({success: false, message: "Unauthorized"})
        }
        if(!booking){
            return res.json({success: false, message: "Booking not found"})
        }        
        booking.status = "cancelled";
        await booking.save();
        
        const mailOptions = {
            ...BookingRequestCancelled(booking),
            to: [booking.owner?.email, TestUserEmail]
        };

        await transporter.sendMail(mailOptions);
        console.log("Booking cancellation email sent to owner :", booking.owner.email);
        
        res.json({
            success: true, 
            message: "Booking cancelled successfully"
        })

    } catch(error){
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
};