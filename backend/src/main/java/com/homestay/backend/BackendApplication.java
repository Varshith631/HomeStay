package com.homestay.backend;

import com.homestay.backend.model.AuthProvider;
import com.homestay.backend.model.Role;
import com.homestay.backend.model.User;
import com.homestay.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.findByEmail("admin@nexus.com").isEmpty()) {
				User admin = User.builder()
						.email("admin@nexus.com")
						.password(passwordEncoder.encode("admin123"))
						.firstName("System")
						.lastName("Admin")
						.role(Role.ROLE_ADMIN)
						.provider(AuthProvider.LOCAL)
						.build();
				userRepository.save(admin);
			}
		};
	}
}
