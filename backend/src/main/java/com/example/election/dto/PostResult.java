package com.example.election.dto;

import java.util.List;

public record PostResult(Long postId, String postName, List<ResultItem> candidates) {}
