package com.homestay.backend.controller;

import com.homestay.backend.dto.AuthResponse;
import com.homestay.backend.dto.LoginRequest;
import com.homestay.backend.dto.SignUpRequest;
import com.homestay.backend.dto.VerifyOtpRequest;
import com.homestay.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.authenticateUser(loginRequest));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest verifyOtpRequest) {
        return ResponseEntity.ok(authService.verifyOtp(verifyOtpRequest));
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        return ResponseEntity.ok(authService.registerUser(signUpRequest));
    }
}
