package com.teamtask.manager.service;

import com.teamtask.manager.config.JwtTokenProvider;
import com.teamtask.manager.dto.request.LoginRequest;
import com.teamtask.manager.dto.request.SignupRequest;
import com.teamtask.manager.dto.response.AuthResponse;
import com.teamtask.manager.exception.BadRequestException;
import com.teamtask.manager.exception.ResourceNotFoundException;
import com.teamtask.manager.model.User;
import com.teamtask.manager.model.enums.Role;
import com.teamtask.manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        logger.info("Processing signup for email: {}", request.getEmail());

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        // Create new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                //.role(Role.MEMBER) // Default role is MEMBER
                .role(userRepository.count() == 0 ? Role.ADMIN : Role.MEMBER)
                .build();

        User savedUser = userRepository.save(user);
        logger.info("User created successfully with ID: {}", savedUser.getId());

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(
                savedUser.getEmail(),
                savedUser.getId(),
                savedUser.getRole().name()
        );

        return AuthResponse.withToken(token)
                .userId(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        logger.info("Processing login for email: {}", request.getEmail());

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logger.warn("Failed login attempt for email: {}", request.getEmail());
            throw new BadRequestException("Invalid email or password");
        }

        logger.info("User logged in successfully: {}", user.getEmail());

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(
                user.getEmail(),
                user.getId(),
                user.getRole().name()
        );

        return AuthResponse.withToken(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}