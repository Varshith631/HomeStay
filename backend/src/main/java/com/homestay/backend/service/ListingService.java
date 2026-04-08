package com.homestay.backend.service;

import com.homestay.backend.dto.ListingDTO;
import com.homestay.backend.model.Listing;
import com.homestay.backend.model.User;
import com.homestay.backend.repository.ListingRepository;
import com.homestay.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;

    public List<ListingDTO> getAllActiveListings() {
        return listingRepository.findByActiveTrue().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<ListingDTO> getListingsByHostId(Long hostId) {
        return listingRepository.findByHostId(hostId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public ListingDTO createListing(Long hostId, ListingDTO listingDTO) {
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new RuntimeException("Host not found"));
        
        Listing listing = Listing.builder()
                .host(host)
                .title(listingDTO.getTitle())
                .description(listingDTO.getDescription())
                .location(listingDTO.getLocation())
                .pricePerNight(listingDTO.getPricePerNight())
                .imageUrl(listingDTO.getImageUrl())
                .active(true)
                .build();
        return mapToDTO(listingRepository.save(listing));
    }

    private ListingDTO mapToDTO(Listing listing) {
        return ListingDTO.builder()
                .id(listing.getId())
                .hostId(listing.getHost().getId())
                .hostName(listing.getHost().getFirstName() + " " + listing.getHost().getLastName())
                .title(listing.getTitle())
                .description(listing.getDescription())
                .location(listing.getLocation())
                .pricePerNight(listing.getPricePerNight())
                .imageUrl(listing.getImageUrl())
                .active(listing.isActive())
                .build();
    }
}
