package com.turfoff.turfbooking.services;

import com.turfoff.turfbooking.domain.mongo.entities.BookingsEntity;
import com.turfoff.turfbooking.repositories.mongo.BookingEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookingEntityServiceImpl implements BookingEntityService {

    @Autowired
    private BookingEntityRepository bookingEntityRepository;

    @Override
    public BookingsEntity addBooking(BookingsEntity bookingEntity) {
        return bookingEntityRepository.save(bookingEntity);
    }
}
