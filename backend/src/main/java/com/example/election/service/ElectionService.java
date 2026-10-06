package com.example.election.service;

import com.example.election.dto.*;
import com.example.election.entity.*;
import com.example.election.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ElectionService {

    private final ElectionRepository electionRepository;
    private final PostRepository postRepository;
    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final VoteRepository voteRepository;

    public ElectionService(
            ElectionRepository electionRepository,
            PostRepository postRepository,
            CandidateRepository candidateRepository,
            UserRepository userRepository,
            VoteRepository voteRepository
    ) {
        this.electionRepository = electionRepository;
        this.postRepository = postRepository;
        this.candidateRepository = candidateRepository;
        this.userRepository = userRepository;
        this.voteRepository = voteRepository;
    }

    public List<Election> getAllElections() {
        return electionRepository.findAllByOrderByStartTimeDesc();
    }

    @Transactional
    public Election createElection(ElectionRequest request) {
        validateTimes(request.startTime(), request.endTime());

        if (request.title() == null || request.title().isBlank()) {
            throw new IllegalArgumentException("Election title is required");
        }

        return electionRepository.save(
                new Election(
                        request.title().trim(),
                        request.description(),
                        request.startTime(),
                        request.endTime()
                )
        );
    }

    public ElectionDetailsResponse getDetails(Long electionId) {
        Election election = getElection(electionId);
        List<Post> posts = postRepository.findByElectionIdOrderByIdAsc(electionId);
        posts.forEach(post -> post.setCandidates(candidateRepository.findByPostIdOrderByNameAsc(post.getId())));
        return ElectionDetailsResponse.from(election, posts);
    }

    @Transactional
    public Post addPost(Long electionId, PostRequest request) {
        Election election = getElection(electionId);

        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("Post name is required");
        }

        if (election.isClosed()) {
            throw new IllegalArgumentException("Cannot add a post after the election has closed");
        }

        return postRepository.save(new Post(request.name().trim(), election));
    }

    @Transactional
    public Candidate addCandidate(Long postId, CandidateRequest request) {
        Post post = getPost(postId);

        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException("Candidate name is required");
        }

        if (post.getElection().isClosed()) {
            throw new IllegalArgumentException("Cannot add a candidate after the election has closed");
        }

        return candidateRepository.save(
                new Candidate(request.name().trim(), request.manifesto(), post)
        );
    }

    @Transactional
    public Vote castVote(VoteRequest request) {
        if (request.studentId() == null || request.postId() == null || request.candidateId() == null) {
            throw new IllegalArgumentException("Student, post and candidate are required");
        }

        User student = userRepository.findById(request.studentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        if (student.getRole() != User.Role.STUDENT) {
            throw new IllegalArgumentException("Only students can vote");
        }

        Post post = getPost(request.postId());
        Candidate candidate = candidateRepository.findById(request.candidateId())
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));

        if (!candidate.getPost().getId().equals(post.getId())) {
            throw new IllegalArgumentException("Candidate does not belong to this post");
        }

        Election election = post.getElection();

        if (!election.isOpen()) {
            throw new IllegalArgumentException("Voting is allowed only during the election period");
        }

        if (voteRepository.existsByStudentIdAndPostId(student.getId(), post.getId())) {
            throw new IllegalArgumentException("You have already voted for this post");
        }

        return voteRepository.save(new Vote(student, post, candidate));
    }

    public List<PostResult> getResults(Long electionId) {
        Election election = getElection(electionId);

        if (!election.isClosed()) {
            throw new IllegalArgumentException("Results will be available after voting closes");
        }

        List<Post> posts = postRepository.findByElectionIdOrderByIdAsc(electionId);
        List<PostResult> results = new ArrayList<>();

        for (Post post : posts) {
            List<Candidate> candidates = candidateRepository.findByPostIdOrderByNameAsc(post.getId());
            List<ResultItem> items = new ArrayList<>();

            for (Candidate candidate : candidates) {
                long count = voteRepository.findByPostId(post.getId()).stream()
                        .filter(v -> v.getCandidate().getId().equals(candidate.getId()))
                        .count();

                items.add(new ResultItem(candidate.getId(), candidate.getName(), count));
            }

            results.add(new PostResult(post.getId(), post.getName(), items));
        }

        return results;
    }

    private Election getElection(Long id) {
        return electionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Election not found"));
    }

    private Post getPost(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
    }

    private void validateTimes(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            throw new IllegalArgumentException("Start and end time are required");
        }

        if (!end.isAfter(start)) {
            throw new IllegalArgumentException("End time must be after start time");
        }
    }
}
