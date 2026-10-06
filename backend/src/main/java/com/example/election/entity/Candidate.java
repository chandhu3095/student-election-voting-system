package com.example.election.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "candidates")
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String manifesto;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id")
    @JsonIgnore
    private Post post;

    public Candidate() {}

    public Candidate(String name, String manifesto, Post post) {
        this.name = name;
        this.manifesto = manifesto;
        this.post = post;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getManifesto() { return manifesto; }
    public Post getPost() { return post; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setManifesto(String manifesto) { this.manifesto = manifesto; }
    public void setPost(Post post) { this.post = post; }
}
