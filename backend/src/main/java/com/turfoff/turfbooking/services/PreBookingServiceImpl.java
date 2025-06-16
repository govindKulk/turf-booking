package com.turfoff.turfbooking.services;


public interface PreBookingServiceImpl {
    void insertPreBooking(String slotId, Long userId);
    void deletePreBooking(String slotId, Long userId);
}
