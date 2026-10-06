package com.example.election.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "votes",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_student_post",
        columnNames = {"student_id", "post_id"}
    )
)
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;

    @Column(nullable = false)
    private LocalDateTime votedAt;

    public Vote() {}

    public Vote(User student, Post post, Candidate candidate) {
        this.student = student;
        this.post = post;
        this.candidate = candidate;
        this.votedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public User getStudent() { return student; }
    public Post getPost() { return post; }
    public Candidate getCandidate() { return candidate; }
    public LocalDateTime getVotedAt() { return votedAt; }

    public void setId(Long id) { this.id = id; }
    public void setStudent(User student) { this.student = student; }
    public void setPost(Post post) { this.post = post; }
    public void setCandidate(Candidate candidate) { this.candidate = candidate; }
    public void setVotedAt(LocalDateTime votedAt) { this.votedAt = votedAt; }
}
