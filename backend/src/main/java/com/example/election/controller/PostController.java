package com.example.election.controller;

import com.example.election.dto.CandidateRequest;
import com.example.election.entity.Candidate;
import com.example.election.service.ElectionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final ElectionService electionService;

    public PostController(ElectionService electionService) {
        this.electionService = electionService;
    }

    @PostMapping("/{postId}/candidates")
    public Candidate addCandidate(
            @PathVariable Long postId,
            @RequestBody CandidateRequest request
    ) {
        return electionService.addCandidate(postId, request);
    }
}
