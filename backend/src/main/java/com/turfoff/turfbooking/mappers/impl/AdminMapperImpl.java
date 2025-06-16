package com.turfoff.turfbooking.mappers.impl;

import com.turfoff.turfbooking.domain.mysql.dto.AdminDto;
import com.turfoff.turfbooking.domain.mysql.entities.AdminEntity;
import com.turfoff.turfbooking.mappers.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class AdminMapperImpl implements Mapper<AdminEntity, AdminDto> {

    private ModelMapper modelMapper;

    public AdminMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public AdminDto mapTo(AdminEntity adminEntity) {
        return modelMapper.map(adminEntity, AdminDto.class);
    }

    @Override
    public AdminEntity mapFrom(AdminDto adminDto) {
        return modelMapper.map(adminDto, AdminEntity.class);
    }
}
