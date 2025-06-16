package com.turfoff.turfbooking.repositories.mysql;

import com.turfoff.turfbooking.domain.mysql.entities.PreBookingEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PreBookingRepository extends JpaRepository<PreBookingEntity, String> {
    @Transactional
    @Modifying
    @Query(value = "INSERT INTO pre_booking (slot_id, user_id) VALUES (:slotId, :userId)", nativeQuery = true)
    void insertPreBooking(String slotId, Long userId);


    void deletePreBookingEntitiesBySlotIdAndUserId(String slotId, Long userId);
}
