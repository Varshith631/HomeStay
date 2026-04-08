package com.homestay.backend.repository;

import com.homestay.backend.model.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByStatus(String status);
    List<Recommendation> findByGuideId(Long guideId);
    List<Recommendation> findByLocationContainingIgnoreCase(String location);
}
