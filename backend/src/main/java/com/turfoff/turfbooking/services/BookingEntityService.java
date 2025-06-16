package com.turfoff.turfbooking.services;

import com.turfoff.turfbooking.domain.mongo.entities.BookingsEntity;

public interface BookingEntityService {
    BookingsEntity addBooking(BookingsEntity bookingEntity);
}
