package com.example.election.repository;

import com.example.election.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByElectionIdOrderByIdAsc(Long electionId);
}
