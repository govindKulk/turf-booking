package com.turfoff.turfbooking.services;

import com.turfoff.turfbooking.domain.mongo.entities.SlotsEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SlotsService {
    List<SlotsEntity> getAllSlotsOfTurf(String turfId, LocalDate date);
    void saveSlots(List<SlotsEntity> slots);
    Optional<SlotsEntity> getSlotById(String slotId);
    int bookSlot(String slotId, String BookingEntityId);
}