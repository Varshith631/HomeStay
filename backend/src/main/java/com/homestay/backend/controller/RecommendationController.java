package com.homestay.backend.controller;

import com.homestay.backend.dto.RecommendationDTO;
import com.homestay.backend.security.UserPrincipal;
import com.homestay.backend.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/public")
    public ResponseEntity<List<RecommendationDTO>> getAllRecommendations() {
        return ResponseEntity.ok(recommendationService.getAllRecommendations());
    }

    @PreAuthorize("hasRole('GUIDE')")
    @PostMapping
    public ResponseEntity<RecommendationDTO> createRecommendation(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody RecommendationDTO recommendationDTO) {
        return ResponseEntity.ok(recommendationService.createRecommendation(currentUser.getId(), recommendationDTO));
    }

    @PreAuthorize("hasRole('GUIDE')")
    @GetMapping("/me")
    public ResponseEntity<List<RecommendationDTO>> getMyRecommendations(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(recommendationService.getRecommendationsByGuide(currentUser.getId()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public ResponseEntity<List<RecommendationDTO>> getPendingRecommendations() {
        return ResponseEntity.ok(recommendationService.getPendingRecommendations());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<RecommendationDTO> updateRecommendationStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(recommendationService.updateRecommendationStatus(id, status));
    }
}
