package com.homestay.backend.repository;

import com.homestay.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByListingId(Long listingId);
    List<Booking> findByTouristId(Long touristId);
    List<Booking> findByListingHostId(Long hostId);
}
