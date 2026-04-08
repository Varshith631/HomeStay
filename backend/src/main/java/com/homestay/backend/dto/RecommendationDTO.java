package com.homestay.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecommendationDTO {
    private Long id;
    private Long guideId;
    private String guideName;
    private String title;
    private String content;
    private String location;
    private String status;
}
