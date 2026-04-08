package com.homestay.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private boolean requiresOtp;
    private String message;
    private String token;
    private String role;
    private String email;
    private String firstName;
    private String lastName;
}
