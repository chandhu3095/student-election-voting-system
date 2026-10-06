package com.example.election.service;

import com.example.election.dto.LoginRequest;
import com.example.election.dto.LoginResponse;
import com.example.election.entity.User;
import com.example.election.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!user.getPassword().equals(request.password())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return new LoginResponse(user.getId(), user.getUsername(), user.getFullName(), user.getRole());
    }
}
