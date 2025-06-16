package com.turfoff.turfbooking.services;

import com.turfoff.turfbooking.domain.mongo.dto.TurfDto;
import com.turfoff.turfbooking.domain.mongo.entities.TurfEntity;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;

import java.util.List;
import java.util.Optional;

public interface TurfService {
    TurfEntity createTurf(TurfEntity turfEntity);
    Optional<TurfEntity> getTurf(String turfId);
    List<TurfEntity> getNearByTurfs(Point point, Distance distance);
    List<TurfEntity>  getAllTurfs();

    List<TurfEntity> getAllTurfsByAdmin(String adminId);
}
