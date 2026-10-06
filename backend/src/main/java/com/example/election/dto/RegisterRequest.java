package com.example.election.dto;

public record RegisterRequest(
        String fullName,
        String studentId,
        String password
) {}