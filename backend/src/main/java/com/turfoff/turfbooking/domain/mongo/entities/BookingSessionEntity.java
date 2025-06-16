package com.turfoff.turfbooking.domain.mongo.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Document(collection = "booking-slot")
public class BookingSessionEntity {
    @Id
    private String id;

    private String bookingId;

    private LocalDate date;

    private LocalTime startTime;

    private int duration;
}
