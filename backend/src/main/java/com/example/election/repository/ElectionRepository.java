package com.example.election.repository;

import com.example.election.entity.Election;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ElectionRepository extends JpaRepository<Election, Long> {
    List<Election> findAllByOrderByStartTimeDesc();
}
