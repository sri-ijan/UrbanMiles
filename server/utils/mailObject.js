const { MAIL_ID, CURRENCY } = process.env;

export const BookingRequestCreated = function (booking) {
  return {
    from: MAIL_ID,
    subject: 'New Booking Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
        <h2 style="color: #333;">New Booking Request</h2>
        <p>You have a new booking request for the car: <strong>${booking.car.brand} ${booking.car.model}</strong>.</p>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Dates:</strong> ${new Date(booking.pickupDate).toDateString()} to ${new Date(booking.returnDate).toDateString()}</p>
        <p><strong>Price:</strong> ${CURRENCY}${booking.price}</p>
        <p>Please log in to your account to view and manage the booking.</p>
      </div>
    `,
  };
};

export const BookingRequestAccepted = function (booking) {
  return {
    from: MAIL_ID,
    subject: 'Booking Request Accepted',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #e6fff2; border-radius: 10px;">
        <h2 style="color: #2e7d32;">Booking Confirmed!</h2>
        <p>Your booking request for the car: <strong>${booking.car.brand} ${booking.car.model}</strong> has been <strong>accepted</strong>.</p>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Dates:</strong> ${new Date(booking.pickupDate).toDateString()} to ${new Date(booking.returnDate).toDateString()}</p>
        <p><strong>Price:</strong> ${CURRENCY}${booking.price}</p>
        <p>You can log in to your account to view your booking details.</p>
      </div>
    `,
  };
};

export const BookingRequestCancelled = function (booking) {
  return {
    from: MAIL_ID,
    subject: 'Booking Request Cancelled',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #fff3f3; border-radius: 10px;">
        <h2 style="color: #c62828;">Booking Cancelled</h2>
        <p>Your booking request for the car: <strong>${booking.car.brand} ${booking.car.model}</strong> has been <strong>cancelled</strong>.</p>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Dates:</strong> ${new Date(booking.pickupDate).toDateString()} to ${new Date(booking.returnDate).toDateString()}</p>
        <p><strong>Price:</strong> ${CURRENCY}${booking.price}</p>
        <p>You can log in to your account to check more details.</p>
      </div>
    `,
  };
};
