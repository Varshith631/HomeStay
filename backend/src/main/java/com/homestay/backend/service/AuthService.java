package com.homestay.backend.service;

import com.homestay.backend.dto.AuthResponse;
import com.homestay.backend.dto.LoginRequest;
import com.homestay.backend.dto.SignUpRequest;
import com.homestay.backend.dto.VerifyOtpRequest;
import com.homestay.backend.model.AuthProvider;
import com.homestay.backend.model.Role;
import com.homestay.backend.model.User;
import com.homestay.backend.repository.UserRepository;
import com.homestay.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final JavaMailSender mailSender;

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        // Look up the user first to ensure they aren't an OAuth-only user
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getProvider() != null && user.getProvider() != AuthProvider.LOCAL) {
            throw new RuntimeException("This account normally logs in via " + user.getProvider() + ". Please click 'Continue with Google' to access your account.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        String jwt = tokenProvider.generateTokenFromUserId(user.getId());

        return AuthResponse.builder()
                .token(jwt)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(user.getOtpCode() == null || !user.getOtpCode().equals(request.getOtpCode())) {
            throw new RuntimeException("Invalid OTP code");
        }

        if(user.getOtpExpiryTime().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("OTP code has expired");
        }

        // Clearing OTP
        user.setOtpCode(null);
        user.setOtpExpiryTime(null);
        userRepository.save(user);

        String jwt = tokenProvider.generateTokenFromUserId(user.getId());

        return AuthResponse.builder()
                .token(jwt)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse registerUser(SignUpRequest signUpRequest) {
        if(userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Email address already in use.");
        }

        Role roleEnum;
        try {
            roleEnum = Role.valueOf("ROLE_" + signUpRequest.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            roleEnum = Role.ROLE_TOURIST; // Default to tourist if invalid role sent
        }

        User user = User.builder()
                .firstName(signUpRequest.getFirstName())
                .lastName(signUpRequest.getLastName())
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .role(roleEnum)
                .provider(AuthProvider.LOCAL)
                .build();

        User savedUser = userRepository.save(user);

        // Generate 6 Digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        savedUser.setOtpCode(otp);
        savedUser.setOtpExpiryTime(java.time.LocalDateTime.now().plusMinutes(10));
        userRepository.save(savedUser);

        // REAL EMAIL SENDING
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(savedUser.getEmail());
            message.setSubject("Welcome to Nexus - Verify your email");
            message.setText("Hello " + savedUser.getFirstName() + ",\n\nWelcome to Nexus! Your One-Time Password (OTP) to activate your account is: " + otp + "\n\nThis code will expire in 10 minutes.\n\nBest,\nNexus Platform Team");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("FAILED TO SEND EMAIL: " + e.getMessage());
        }

        return AuthResponse.builder()
                .requiresOtp(true)
                .message("OTP sent to your email to verify your new account.")
                .email(savedUser.getEmail())
                .build();
    }
}
