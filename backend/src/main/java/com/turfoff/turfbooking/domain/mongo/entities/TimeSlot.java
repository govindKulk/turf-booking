package com.turfoff.turfbooking.domain.mongo.entities;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
@Builder
public class TimeSlot {
    private LocalTime startTime;
    private LocalTime endTime;
}
