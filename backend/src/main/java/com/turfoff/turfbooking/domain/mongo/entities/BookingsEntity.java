package com.turfoff.turfbooking.domain.mongo.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Document(collection = "bookings")
public class BookingsEntity {
    @Id
    private String id;

    private Long userId;

    private String turfId;

    private String status;

    private float amount;

    private String coupon;

    private float discount;

    private LocalDateTime bookingDateTime;

    private String transactionType;

    private String generatedTransactionId;
}
