package com.turfoff.turfbooking.repositories.mongo;

import com.turfoff.turfbooking.domain.mongo.entities.SlotsEntity;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class CustomSlotRepositoryImpl implements CustomSlotRepository {

    private final MongoTemplate mongoTemplate;

    public CustomSlotRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public List<SlotsEntity> findBookedSlotsByUserId(Long userId) {
        // Define the aggregation pipeline stages

        Aggregation aggregation = Aggregation.newAggregation(
                // Match stage to filter documents with slotStatus as "BOOKED"
                Aggregation.match(Criteria.where("slotStatus").is("BOOKED")),

                // Match stage to filter documents with endTime less than the current date and time
                Aggregation.match(Criteria.where("slot.endTime").lt(LocalDateTime.now())),

                // AddFields stage to convert bookingEntityId from String to ObjectId
                Aggregation.addFields().addField("bookingEntityIdObj")
                        .withValue(ConvertOperators.ToObjectId.toObjectId("$bookingEntityId")).build(),

                // Lookup stage to join with the bookings collection
                LookupOperation.newLookup()
                        .from("bookings")
                        .localField("bookingEntityIdObj")
                        .foreignField("_id")
                        .as("bookingDetails"),

                // Unwind stage to flatten the bookingDetails array
                Aggregation.unwind("bookingDetails"),

                // Match stage to filter documents for the specified userId in bookingDetails
                Aggregation.match(Criteria.where("bookingDetails.userId").is(userId))
        );

        // Execute the aggregation and return the results
        AggregationResults<SlotsEntity> results = mongoTemplate.aggregate(aggregation, "Slots", SlotsEntity.class);
        return results.getMappedResults();
    }
}
