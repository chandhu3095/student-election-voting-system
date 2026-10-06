package com.example.election.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "election_id")
    @JsonIgnore
    private Election election;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Candidate> candidates = new ArrayList<>();

    public Post() {}

    public Post(String name, Election election) {
        this.name = name;
        this.election = election;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Election getElection() { return election; }
    public List<Candidate> getCandidates() { return candidates; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setElection(Election election) { this.election = election; }
    public void setCandidates(List<Candidate> candidates) { this.candidates = candidates; }
}
