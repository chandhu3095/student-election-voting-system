package com.example.election.dto;

import com.example.election.entity.User;

public record LoginResponse(Long id, String username, String fullName, User.Role role) {}
