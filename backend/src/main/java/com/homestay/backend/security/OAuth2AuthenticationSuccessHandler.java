package com.homestay.backend.security;

import com.homestay.backend.model.AuthProvider;
import com.homestay.backend.model.Role;
import com.homestay.backend.model.User;
import com.homestay.backend.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @org.springframework.beans.factory.annotation.Value("${app.cors.allowed-origins:http://localhost:5173}")
    private String frontendUrl;

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");
        String providerId = oAuth2User.getAttribute("sub");
        String picture = oAuth2User.getAttribute("picture");

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        if(userOptional.isPresent()) {
            user = userOptional.get();
            if(!user.getProvider().equals(AuthProvider.GOOGLE)) {
                throw new RuntimeException("Looks like you're signed up with " + user.getProvider() + " account. Please use your " + user.getProvider() + " account to login.");
            }
            user = updateExistingUser(user, firstName, lastName, picture);
        } else {
            user = registerNewUser(email, firstName, lastName, providerId, picture);
        }

        String token = tokenProvider.generateTokenFromUserId(user.getId());

        String baseUrl = frontendUrl.contains(",") ? frontendUrl.split(",")[0] : frontendUrl;
        
        String targetUrl = UriComponentsBuilder.fromUriString(baseUrl + "/oauth2/redirect")
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private User registerNewUser(String email, String firstName, String lastName, String providerId, String picture) {
        User user = new User();
        user.setProvider(AuthProvider.GOOGLE);
        user.setProviderId(providerId);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setImageUrl(picture);
        user.setRole(Role.ROLE_TOURIST); // Default role
        return userRepository.save(user);
    }

    private User updateExistingUser(User existingUser, String firstName, String lastName, String picture) {
        existingUser.setFirstName(firstName);
        existingUser.setLastName(lastName);
        existingUser.setImageUrl(picture);
        return userRepository.save(existingUser);
    }
}
