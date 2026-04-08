package com.homestay.backend.service;

import com.homestay.backend.dto.RecommendationDTO;
import com.homestay.backend.model.Recommendation;
import com.homestay.backend.model.User;
import com.homestay.backend.repository.RecommendationRepository;
import com.homestay.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final UserRepository userRepository;

    public List<RecommendationDTO> getAllRecommendations() {
        return recommendationRepository.findByStatus("APPROVED").stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<RecommendationDTO> getPendingRecommendations() {
        return recommendationRepository.findByStatus("PENDING").stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<RecommendationDTO> getRecommendationsByGuide(Long guideId) {
        return recommendationRepository.findByGuideId(guideId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public RecommendationDTO updateRecommendationStatus(Long id, String status) {
        Recommendation rec = recommendationRepository.findById(id).orElseThrow();
        rec.setStatus(status);
        return mapToDTO(recommendationRepository.save(rec));
    }

    public RecommendationDTO createRecommendation(Long guideId, RecommendationDTO dto) {
        User guide = userRepository.findById(guideId).orElseThrow();

        Recommendation recommendation = Recommendation.builder()
                .guide(guide)
                .title(dto.getTitle())
                .content(dto.getContent())
                .location(dto.getLocation())
                .build();

        return mapToDTO(recommendationRepository.save(recommendation));
    }

    private RecommendationDTO mapToDTO(Recommendation rec) {
        return RecommendationDTO.builder()
                .id(rec.getId())
                .guideId(rec.getGuide().getId())
                .guideName(rec.getGuide().getFirstName() + " " + rec.getGuide().getLastName())
                .title(rec.getTitle())
                .content(rec.getContent())
                .location(rec.getLocation())
                .status(rec.getStatus())
                .build();
    }
}
