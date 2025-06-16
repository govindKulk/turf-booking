package com.turfoff.turfbooking.services;

import com.turfoff.turfbooking.domain.mongo.dto.TurfDto;
import com.turfoff.turfbooking.domain.mongo.entities.TurfEntity;
import com.turfoff.turfbooking.repositories.mongo.TurfRepository;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TurfServiceImpl implements TurfService {

    private TurfRepository turfRepository;

    public TurfServiceImpl(TurfRepository turfRepository) {
        this.turfRepository = turfRepository;
    }

    @Override
    public TurfEntity createTurf(TurfEntity turfEntity) {
        return turfRepository.save(turfEntity);
    }

    @Override
    public Optional<TurfEntity> getTurf(String turfId) {
        return turfRepository.findById(turfId);
    }

    @Override
    public List<TurfEntity> getNearByTurfs(Point point, Distance distance) {
        return turfRepository.findByCoordinatesNearOrderByCoordinatesAsc(point, distance);
    }

    @Override
    public  List<TurfEntity> getAllTurfs() {
        return turfRepository.findAll();

    }

}
