package com.turfoff.turfbooking.mappers.impl;

import com.turfoff.turfbooking.domain.mongo.dto.TurfDto;
import com.turfoff.turfbooking.domain.mongo.entities.TurfEntity;
import com.turfoff.turfbooking.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class TurfMapperImpl implements Mapper<TurfEntity, TurfDto> {

    private ModelMapper modelMapper;

    public TurfMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public TurfDto mapTo(TurfEntity turfEntity) {
        return modelMapper.map(turfEntity, TurfDto.class);
    }

    @Override
    public TurfEntity mapFrom(TurfDto turfDto) {
        return modelMapper.map(turfDto, TurfEntity.class);
    }
}
