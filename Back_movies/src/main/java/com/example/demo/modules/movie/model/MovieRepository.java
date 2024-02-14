package com.example.demo.modules.movie.model;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface MovieRepository extends JpaRepository<Movie, Long>{
        Page<Movie> findAll(Pageable pageable);
        Page<Movie> findAllByTitleIgnoreCase(Pageable pageable, String title);
}