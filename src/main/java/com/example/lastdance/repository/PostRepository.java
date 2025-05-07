package com.example.lastdance.repository;

import com.example.lastdance.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {

    // 게시판 ID(board.bId)로 게시글 페이지 조회
    Page<Post> findByBoard_BId(Long boardId, Pageable pageable);
}
