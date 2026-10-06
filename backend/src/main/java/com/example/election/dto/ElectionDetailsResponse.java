package com.example.election.dto;

import com.example.election.entity.Election;
import com.example.election.entity.Post;
import com.example.election.entity.Candidate;
import java.util.List;

public record ElectionDetailsResponse(
        Long id,
        String title,
        String description,
        java.time.LocalDateTime startTime,
        java.time.LocalDateTime endTime,
        boolean open,
        boolean closed,
        List<PostView> posts
) {
    public record PostView(Long id, String name, List<CandidateView> candidates) {}
    public record CandidateView(Long id, String name, String manifesto) {}

    public static ElectionDetailsResponse from(Election election, List<Post> posts) {
        return new ElectionDetailsResponse(
                election.getId(),
                election.getTitle(),
                election.getDescription(),
                election.getStartTime(),
                election.getEndTime(),
                election.isOpen(),
                election.isClosed(),
                posts.stream().map(post ->
                    new PostView(
                        post.getId(),
                        post.getName(),
                        post.getCandidates().stream()
                            .map(c -> new CandidateView(c.getId(), c.getName(), c.getManifesto()))
                            .toList()
                    )
                ).toList()
        );
    }
}
