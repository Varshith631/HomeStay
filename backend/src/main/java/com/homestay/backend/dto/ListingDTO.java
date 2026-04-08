package com.homestay.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ListingDTO {
    private Long id;
    private Long hostId;
    private String hostName;
    private String title;
    private String description;
    private String location;
    private BigDecimal pricePerNight;
    private String imageUrl;
    private boolean active;
}
