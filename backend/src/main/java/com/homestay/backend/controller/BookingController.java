package com.homestay.backend.controller;

import com.homestay.backend.dto.BookingDTO;
import com.homestay.backend.security.UserPrincipal;
import com.homestay.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PreAuthorize("hasRole('TOURIST')")
    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody BookingDTO bookingDTO) {
        return ResponseEntity.ok(bookingService.createBooking(currentUser.getId(), bookingDTO));
    }

    @PreAuthorize("hasRole('TOURIST')")
    @GetMapping("/me")
    public ResponseEntity<List<BookingDTO>> getMyBookings(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(bookingService.getTouristBookings(currentUser.getId()));
    }

    @PreAuthorize("hasRole('HOST')")
    @GetMapping("/host")
    public ResponseEntity<List<BookingDTO>> getHostBookings(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(bookingService.getHostBookings(currentUser.getId()));
    }

    @PreAuthorize("hasRole('HOST')")
    @PutMapping("/{bookingId}/status")
    public ResponseEntity<BookingDTO> updateBookingStatus(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long bookingId,
            @RequestParam String status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(currentUser.getId(), bookingId, status));
    }
}
