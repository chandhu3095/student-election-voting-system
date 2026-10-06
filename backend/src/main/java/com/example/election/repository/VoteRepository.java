package com.example.election.repository;

import com.example.election.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByStudentIdAndPostId(Long studentId, Long postId);
    List<Vote> findByPostId(Long postId);
    List<Vote> findByPostElectionId(Long electionId);
}
