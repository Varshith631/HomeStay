package com.homestay.backend.service;

import com.homestay.backend.dto.BookingDTO;
import com.homestay.backend.model.Booking;
import com.homestay.backend.model.BookingStatus;
import com.homestay.backend.model.Listing;
import com.homestay.backend.model.User;
import com.homestay.backend.repository.BookingRepository;
import com.homestay.backend.repository.ListingRepository;
import com.homestay.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;

    public BookingDTO createBooking(Long touristId, BookingDTO dto) {
        User tourist = userRepository.findById(touristId).orElseThrow();
        Listing listing = listingRepository.findById(dto.getListingId()).orElseThrow();

        Booking booking = Booking.builder()
                .tourist(tourist)
                .listing(listing)
                .checkInDate(dto.getCheckInDate())
                .checkOutDate(dto.getCheckOutDate())
                .totalPrice(dto.getTotalPrice())
                .status(BookingStatus.PENDING)
                .build();
        
        return mapToDTO(bookingRepository.save(booking));
    }

    public List<BookingDTO> getTouristBookings(Long touristId) {
        return bookingRepository.findByTouristId(touristId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<BookingDTO> getHostBookings(Long hostId) {
        return bookingRepository.findByListingHostId(hostId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public BookingDTO updateBookingStatus(Long hostId, Long bookingId, String statusStr) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getListing().getHost().getId().equals(hostId)) {
            throw new RuntimeException("Unauthorized: You do not own the property for this booking.");
        }
        
        BookingStatus status = BookingStatus.valueOf(statusStr.toUpperCase());
        booking.setStatus(status);
        return mapToDTO(bookingRepository.save(booking));
    }

    private BookingDTO mapToDTO(Booking booking) {
        return BookingDTO.builder()
                .id(booking.getId())
                .listingId(booking.getListing().getId())
                .listingTitle(booking.getListing().getTitle())
                .touristId(booking.getTourist().getId())
                .touristName(booking.getTourist().getFirstName() + " " + booking.getTourist().getLastName())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .build();
    }
}
