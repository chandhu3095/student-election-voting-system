package com.example.election.service;

import org.springframework.stereotype.Service;

import com.example.election.dto.LoginRequest;
import com.example.election.dto.LoginResponse;
import com.example.election.dto.RegisterRequest;
import com.example.election.entity.User;
import com.example.election.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid username or password"));

        if (!user.getPassword().equals(request.password())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getRole()
        );
    }

    public LoginResponse register(RegisterRequest request) {

        if (request.fullName() == null || request.fullName().isBlank()) {
            throw new IllegalArgumentException("Full name is required");
        }

        if (request.studentId() == null || request.studentId().isBlank()) {
            throw new IllegalArgumentException("Student ID is required");
        }

        if (request.password() == null || request.password().length() < 6) {
            throw new IllegalArgumentException(
                    "Password must be at least 6 characters"
            );
        }

        if (userRepository.findByUsername(request.studentId()).isPresent()) {
            throw new IllegalArgumentException(
                    "Student ID is already registered"
            );
        }

        User student = new User(
                request.studentId(),
                request.password(),
                request.fullName(),
                User.Role.STUDENT
        );

        User saved = userRepository.save(student);

        return new LoginResponse(
                saved.getId(),
                saved.getUsername(),
                saved.getFullName(),
                saved.getRole()
        );
    }
}