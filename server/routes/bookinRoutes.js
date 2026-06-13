import express from "express";
import { cancelBooking, changeBookingStatus, checkAvailability, checkAvailabilityOfCar, createBooking, getOwnerBookings, getUserBookings } from "../controller/bookingController.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability',checkAvailabilityOfCar)
bookingRouter.post('/check-if-available',protect, checkAvailability)
bookingRouter.post('/create',protect,createBooking)
bookingRouter.get('/user',protect,getUserBookings)
bookingRouter.get('/owner',protect,getOwnerBookings)
bookingRouter.post('/change-status',protect,changeBookingStatus)
bookingRouter.post('/cancel', protect, cancelBooking);

export default bookingRouter;