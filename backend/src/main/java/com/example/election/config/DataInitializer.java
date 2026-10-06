package com.example.election.config;

import com.example.election.entity.*;
import com.example.election.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeData(
            UserRepository userRepository,
            ElectionRepository electionRepository,
            PostRepository postRepository,
            CandidateRepository candidateRepository
    ) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(new User(
                        "admin", "admin123", "Election Administrator", User.Role.ADMIN
                ));

                userRepository.save(new User(
                        "student1", "student123", "Aarav Student", User.Role.STUDENT
                ));

                userRepository.save(new User(
                        "student2", "student123", "Meera Student", User.Role.STUDENT
                ));
            }

            if (electionRepository.count() == 0) {
                LocalDateTime now = LocalDateTime.now();

                Election election = electionRepository.save(
                        new Election(
                                "Student Council Election 2026",
                                "Sample election for testing the complete voting workflow.",
                                now.minusMinutes(10),
                                now.plusDays(7)
                        )
                );

                Post president = postRepository.save(new Post("President", election));
                Post secretary = postRepository.save(new Post("General Secretary", election));
                Post cultural = postRepository.save(new Post("Cultural Secretary", election));

                candidateRepository.save(new Candidate(
                        "Ananya Rao",
                        "Improve student activities and campus engagement.",
                        president
                ));
                candidateRepository.save(new Candidate(
                        "Rahul Kumar",
                        "Focus on student welfare and transparent communication.",
                        president
                ));

                candidateRepository.save(new Candidate(
                        "Ishaan Verma",
                        "Build stronger academic and student communities.",
                        secretary
                ));
                candidateRepository.save(new Candidate(
                        "Diya Sharma",
                        "Improve student feedback and event coordination.",
                        secretary
                ));

                candidateRepository.save(new Candidate(
                        "Kavya Reddy",
                        "Create more cultural events and creative clubs.",
                        cultural
                ));
                candidateRepository.save(new Candidate(
                        "Arjun Nair",
                        "Promote inclusive campus activities.",
                        cultural
                ));
            }
        };
    }
}
