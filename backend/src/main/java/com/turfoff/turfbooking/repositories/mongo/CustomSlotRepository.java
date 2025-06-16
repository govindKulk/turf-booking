package com.turfoff.turfbooking.repositories.mongo;

import com.turfoff.turfbooking.domain.mongo.entities.SlotsEntity;

import java.util.List;

public interface CustomSlotRepository {
    List<SlotsEntity> findBookedSlotsByUserId(Long userId);
}
