package com.example.election.controller;

import com.example.election.dto.VoteRequest;
import com.example.election.entity.Vote;
import com.example.election.service.ElectionService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/votes")
public class VoteController {

    private final ElectionService electionService;

    public VoteController(ElectionService electionService) {
        this.electionService = electionService;
    }

    @PostMapping
    public Map<String, Object> castVote(@RequestBody VoteRequest request) {
        Vote vote = electionService.castVote(request);
        return Map.of(
                "message", "Vote recorded successfully",
                "voteId", vote.getId(),
                "postId", vote.getPost().getId(),
                "candidateId", vote.getCandidate().getId()
        );
    }
}
