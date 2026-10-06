package com.example.election.controller;

import com.example.election.dto.*;
import com.example.election.entity.*;
import com.example.election.service.ElectionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/elections")
public class ElectionController {

    private final ElectionService electionService;

    public ElectionController(ElectionService electionService) {
        this.electionService = electionService;
    }

    @GetMapping
    public List<Election> getElections() {
        return electionService.getAllElections();
    }

    @GetMapping("/{id}")
    public ElectionDetailsResponse getElection(@PathVariable Long id) {
        return electionService.getDetails(id);
    }

    @PostMapping
    public Election createElection(@RequestBody ElectionRequest request) {
        return electionService.createElection(request);
    }

    @PostMapping("/{electionId}/posts")
    public Post addPost(
            @PathVariable Long electionId,
            @RequestBody PostRequest request
    ) {
        return electionService.addPost(electionId, request);
    }

    @GetMapping("/{electionId}/results")
    public List<PostResult> results(@PathVariable Long electionId) {
        return electionService.getResults(electionId);
    }
}
