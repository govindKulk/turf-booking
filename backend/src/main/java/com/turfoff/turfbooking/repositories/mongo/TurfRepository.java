package com.turfoff.turfbooking.repositories.mongo;

import com.turfoff.turfbooking.domain.mongo.entities.TurfEntity;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TurfRepository extends MongoRepository<TurfEntity,String> {
    List<TurfEntity> findByCoordinatesNearOrderByCoordinatesAsc(Point point, Distance distance);

    @Query("SELECT * FROM TurfEntity tu WHERE tu.owner = :owner")
    List<TurfEntity> findByOwner(String owner);
}
