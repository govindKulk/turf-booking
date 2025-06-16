package com.turfoff.turfbooking.domain.misc;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SlotBookingInputEntity {
    private String slotId;
    private Long userId;
}