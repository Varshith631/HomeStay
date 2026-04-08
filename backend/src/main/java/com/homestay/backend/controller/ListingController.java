package com.homestay.backend.controller;

import com.homestay.backend.dto.ListingDTO;
import com.homestay.backend.security.UserPrincipal;
import com.homestay.backend.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    @GetMapping("/public")
    public ResponseEntity<List<ListingDTO>> getAllActiveListings() {
        return ResponseEntity.ok(listingService.getAllActiveListings());
    }

    @PreAuthorize("hasRole('HOST')")
    @PostMapping
    public ResponseEntity<ListingDTO> createListing(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody ListingDTO listingDTO) {
        return ResponseEntity.ok(listingService.createListing(currentUser.getId(), listingDTO));
    }

    @PreAuthorize("hasRole('HOST')")
    @GetMapping("/me")
    public ResponseEntity<List<ListingDTO>> getMyListings(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(listingService.getListingsByHostId(currentUser.getId()));
    }
}
