import Booking from '../models/booking.js';

export const isCarAvailableForDates = async (carId, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    car: carId,
    status: { $nin: ['cancelled'] },
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
  });

  return bookings.length === 0;
};