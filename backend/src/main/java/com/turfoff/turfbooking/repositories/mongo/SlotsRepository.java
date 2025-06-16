package com.turfoff.turfbooking.repositories.mongo;

import com.turfoff.turfbooking.domain.mongo.entities.SlotsEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SlotsRepository extends MongoRepository<SlotsEntity, String>, CustomSlotRepository {
    List<SlotsEntity> findByTurfIdAndDate(String turfId, LocalDate date);
    Optional<SlotsEntity> findById(String turfId);

    @Query("{ '_id': ?0 }")
    @Update("{ '$set': { 'slotStatus': ?1, 'bookingEntityId' : ?2 } }")
    int updateSlotStatusAndBookingEntityIdById(String id, String slotStatus, String bookingEntityId);

    /*@Aggregation(pipeline = {
            "{ '$match': { 'slotStatus': 'BOOKED' } }",
            "{ '$match': { 'slot.endTime': { '$lt': ?1 } } }",
            "{ '$lookup': { 'from': 'bookings', 'localField': 'bookingEntityId', 'foreignField': '_id', 'as': 'bookingDetails' } }",
            "{ '$unwind': '$bookingDetails' }",
            "{ '$match': { 'bookingDetails.userId': ?0 } }"
    })
    List<SlotsEntity> findBookedSlotsByUserId(String userId, Date currentTime);*/
}