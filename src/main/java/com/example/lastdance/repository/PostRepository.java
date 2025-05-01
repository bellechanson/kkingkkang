package com.example.lastdance.repository;

import com.example.lastdance.dto.PostResponseDto;
import com.example.lastdance.entity.Post;
import org.springdoc.core.converters.models.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {

}
