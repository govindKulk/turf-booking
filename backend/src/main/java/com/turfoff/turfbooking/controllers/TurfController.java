package com.turfoff.turfbooking.controllers;

import com.turfoff.turfbooking.domain.misc.SlotBookingInputEntity;
import com.turfoff.turfbooking.domain.mongo.dto.TurfDto;
import com.turfoff.turfbooking.domain.mongo.entities.BookingsEntity;
import com.turfoff.turfbooking.domain.mongo.entities.SlotsEntity;
import com.turfoff.turfbooking.domain.mongo.entities.TimeSlot;
import com.turfoff.turfbooking.domain.mongo.entities.TurfEntity;
import com.turfoff.turfbooking.mappers.impl.TurfMapperImpl;
import com.turfoff.turfbooking.services.BookingEntityService;
import com.turfoff.turfbooking.services.PreBookingService;
import com.turfoff.turfbooking.services.SlotsService;
import com.turfoff.turfbooking.services.TurfService;
import com.turfoff.turfbooking.utilities.SlotStatus;
import com.turfoff.turfbooking.utilities.TurfStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/turfs")
@Tag(name = "Turf APIs", description = "APIs for turf related operations")
public class TurfController {
    private final TurfMapperImpl turfMapper;
    private final TurfService turfService;
    private final SlotsService slotsService;
    private final BookingEntityService bookingEntityService;
    private final PreBookingService preBookingService;

    public TurfController(TurfService turfService, TurfMapperImpl turfMapper, SlotsService slotsService, BookingEntityService bookingEntityService, PreBookingService preBookingService) {
        this.turfService = turfService;
        this.turfMapper = turfMapper;
        this.slotsService = slotsService;
        this.bookingEntityService = bookingEntityService;
        this.preBookingService = preBookingService;
    }

    List<TimeSlot> generateTimingsForSlotsWithDuration(LocalTime openingTime, int slotDuration) {
        LocalTime entryTime = openingTime;
        List<TimeSlot> timeSlots = new ArrayList<>();
        LocalTime slotStartTime = openingTime;
        LocalTime slotEndTime = slotStartTime.plusMinutes(slotDuration);

        int safetyCounter = 120;
        int slotCounter = 0;
        while (true) {
            timeSlots.add(new TimeSlot(slotStartTime, slotEndTime));
            slotStartTime = slotEndTime;
            slotEndTime = slotStartTime.plusMinutes(slotDuration);
            if (slotCounter == safetyCounter) {
                break;
            }
            if (slotEndTime.equals(entryTime)) {
                timeSlots.add(new TimeSlot(slotStartTime, slotEndTime));
                break;
            }
            slotCounter++;
        }
        return timeSlots;
    }



    List<SlotsEntity> generateTurfSlots(TurfEntity turfEntity, LocalDate date) {
        String turfId = turfEntity.getId();
        int slotDuration = turfEntity.getSlotDuration();
        int startHour = turfEntity.getStartHour();

        int numDayOfWeek = date.getDayOfWeek().getValue();

        LocalDate startDate = date.minusDays(numDayOfWeek-1);
        LocalDate endDate = startDate.plusDays(7);

        List<TimeSlot> timeSlots = generateTimingsForSlotsWithDuration(
                LocalTime.of(startHour, 0), slotDuration
        );

        List<SlotsEntity> daySlots = new ArrayList<>();
        while(startDate.isBefore(endDate)) {
            //check if the date already exists in the database
            List<SlotsEntity> slotsEntities = slotsService.getAllSlotsOfTurf(turfId, startDate);

            //if slots exists then skip
            if(!slotsEntities.isEmpty()) {
                startDate = startDate.plusDays(1);
                continue;
            }

            // else generate the slots and insert
            List<SlotsEntity> slots = new ArrayList<>();
            for (TimeSlot timeslot : timeSlots) {
                SlotsEntity slot = SlotsEntity.builder()
                        .turfId(turfId)
                        .date(startDate)
                        .slot(new TimeSlot(timeslot.getStartTime(), timeslot.getEndTime()))
                        .slotStatus(SlotStatus.VACANT)
                        .build();
                slots.add(slot);
            }
            // we save the slots we want so that we can return them to the user.
            if (startDate.isEqual(date)) {
                daySlots.addAll(slots);
            }

            // save the slots in the database.
            slotsService.saveSlots(slots);

            // increment for the loop
            startDate = startDate.plusDays(1);
        }
        return daySlots;
    }

    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN', 'SUPER_ADMIN')")
    @GetMapping("/getAll")
    public ResponseEntity<List<TurfDto>> getAll() {
        List<TurfEntity> turfEntities = turfService.getAllTurfs();
        List<TurfDto> turfs = turfEntities.stream()
                .map(turfMapper::mapTo)
                .collect(Collectors.toList());
        System.out.println("turfs" + turfs.toString());
        return new ResponseEntity<List<TurfDto>>(turfs, HttpStatus.OK);
    }


    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ROLE_ADMIN')")
    @PostMapping(path = "/new")
    @Operation(
            summary = "New Turf",
            description = "This API can be used to create a new turf entity in the application."
    )
    public ResponseEntity<TurfEntity> createTurf(@RequestBody final TurfDto turfDto) {
        turfDto.setStatus(TurfStatus.INACTIVE);
        turfDto.setCreatedAt(LocalDateTime.now());
        TurfEntity turfEntity = turfMapper.mapFrom(turfDto);
        TurfEntity createdTurfEntity = turfService.createTurf(turfEntity);
        return new ResponseEntity<>(createdTurfEntity, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ROLE_ADMIN')")
    @GetMapping(path = "/{id}")
    @Operation(
            summary = "Get Turf details",
            description = "This API can be used to fetch the basic details of a particular turf."
    )
    public ResponseEntity getTurfById(@PathVariable final String id) {
        Optional<TurfEntity> turfEntity = turfService.getTurf(id);
        if (turfEntity.isPresent()) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Successfully fetched turf with id " + id);
            map.put("data", turfMapper.mapTo(turfEntity.get()));
            return new ResponseEntity<>(map, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ROLE_ADMIN')")
    @PutMapping(path = "/{id}")
    @Operation(
            summary = "Update Turf",
            description = "Update details of a particular Turf using this API."
    )
    public ResponseEntity<TurfEntity> updateTurf(@PathVariable String id, @RequestBody final TurfDto turfDto) {
        turfDto.setId(id);
//        turfDto.setLastModifiedAt(LocalDateTime.now());
        TurfEntity turfEntity = turfMapper.mapFrom(turfDto);
        TurfEntity createdTurfEntity = turfService.createTurf(turfEntity);
        return new ResponseEntity<>(createdTurfEntity, HttpStatus.ACCEPTED);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_USER')")
    @GetMapping(path = "/getNearByTurfs")
    @Operation(
            summary = "Get Near-by Turfs",
            description = "We can get a list of turfs/events located near a specific point of location"
    )
    public ResponseEntity getNearByTurfs(@RequestParam String latitude, @RequestParam String longitude, @RequestParam String radiusInKm) {
        double latitudeCoordinate = Double.parseDouble(latitude);
        double longitudeCoordinate = Double.parseDouble(longitude);
        double radius = Double.parseDouble(radiusInKm);

        Point point = new Point(latitudeCoordinate, longitudeCoordinate);
        Distance distance = new Distance(radius, Metrics.KILOMETERS);
        List<TurfEntity> turfList = turfService.getNearByTurfs(point, distance);
        return new ResponseEntity<>(turfList, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_USER')")
    @GetMapping("/getSlots")
    @Operation(
            summary = "Slots list",
            description = "This API will fetch all the slots of a particular turf along with the status of each slot."
    )
    public ResponseEntity getTurfSlots(@RequestParam String turfId, @RequestParam String dateString) throws Exception {
        try {
            LocalDate date = LocalDate.parse(dateString);
            Optional<TurfEntity> turf = turfService.getTurf(turfId);
            if (turf.isPresent()) {
                TurfEntity turfEntity = turf.get();

                List<SlotsEntity> availableSlots = slotsService.getAllSlotsOfTurf(turfId, date);

                if (availableSlots.isEmpty()) {
                    availableSlots = generateTurfSlots(turfEntity, date);
                }

                return new ResponseEntity<>(availableSlots, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_USER')")
    @PostMapping("/bookSlot")
    @Operation(
            summary = "Book slot",
            description = "This API will book a particular slot for a user."
    )
    public ResponseEntity bookSlot(@RequestBody SlotBookingInputEntity slotBookingInputData) {

        String slotId = slotBookingInputData.getSlotId();
        Long userId = slotBookingInputData.getUserId();

        // check if the slot is already booked or not.
        Optional<SlotsEntity> slot = slotsService.getSlotById(slotId);

        // if the slot is not booked then book the slot.
        if (slot.isPresent()) {
            // try to save the slot in the pre-booking table
            // if we get an error while inserting saying duplicate entry then we can throw error
            // if the entry is inserted then the slot is available and can be booked.

            try {
                preBookingService.insertPreBooking(slotId, userId);
            }
            catch (Exception e) {
                System.out.println(e);
                Map<String, Object> map = new HashMap<>();
                map.put("message", "Unexpected Error. The slot got booked by some other user. Try Again with some other slot.");
                return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
            }

            LocalDateTime localDateTime = LocalDateTime.now();

            //generate the booking
            BookingsEntity bookingsEntity = BookingsEntity.builder()
                    .userId(userId)
                    .turfId(slot.get().getTurfId())
                    .amount(700)
                    .discount(0)
                    .bookingDateTime(localDateTime)
                    .generatedTransactionId("CASH")
                    .build();
            BookingsEntity savedBookingEntity = bookingEntityService.addBooking(bookingsEntity);

            // if entry was possible then book the slot
            slotsService.bookSlot(slotId, savedBookingEntity.getId());

//            // delete the slot since the booking is complete and no new duplicate record will be required. [yet to be tested]
//            preBookingService.deletePreBooking(slotId, userId);

            return new ResponseEntity<>(HttpStatus.OK);

        }
        else {
            // provided slot does not exist, send error message.
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Could not find the slot with information provided.");
            return new ResponseEntity<>(map, HttpStatus.EXPECTATION_FAILED); //417 because the id should have been an actual slot id.
        }
    }

}
