package com.turfoff.turfbooking.services;

import com.turfoff.turfbooking.domain.mongo.entities.SlotsEntity;
import com.turfoff.turfbooking.repositories.mongo.SlotsRepository;
import com.turfoff.turfbooking.utilities.SlotStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SlotsServiceImpl implements SlotsService {

    @Autowired
    private SlotsRepository slotsRepository;

    @Override
    public List<SlotsEntity> getAllSlotsOfTurf(String turfId, LocalDate date) {
        return slotsRepository.findByTurfIdAndDate(turfId, date);
    }

    @Override
    public void saveSlots(List<SlotsEntity> slots) {
        slotsRepository.saveAll(slots);
    }

    @Override
    public Optional<SlotsEntity> getSlotById(String slotId) {
        return slotsRepository.findById(slotId);
    }

    @Override
    public int bookSlot(String slotId, String bookingEntityId) {
        return slotsRepository.updateSlotStatusAndBookingEntityIdById(slotId, String.valueOf(SlotStatus.BOOKED), bookingEntityId);
    }
}