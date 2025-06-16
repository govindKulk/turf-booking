package com.turfoff.turfbooking.services;

import com.turfoff.turfbooking.repositories.mysql.PreBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PreBookingService implements PreBookingServiceImpl{

    @Autowired
    private PreBookingRepository preBookingRepository;

    @Override
    public void insertPreBooking(String slotId, Long userId) {
        preBookingRepository.insertPreBooking(slotId, userId);
    }

    @Override
    public void deletePreBooking(String slotId, Long userId) {
        preBookingRepository.deletePreBookingEntitiesBySlotIdAndUserId(slotId, userId);
    }
}
