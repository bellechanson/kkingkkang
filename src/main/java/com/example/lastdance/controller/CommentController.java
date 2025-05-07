package com.example.lastdance.controller;

import com.example.lastdance.entity.Comment;
import com.example.lastdance.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.lastdance.dto.CommentResponseDto;

import java.util.List;

/**
 * 댓글 관련 HTTP 요청을 처리하는 REST 컨트롤러입니다.
 * 클라이언트로부터 댓글 생성, 수정, 삭제, 조회 요청을 받아 서비스 계층에 위임합니다.
 */
@RestController
@RequestMapping("/api/boards/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    /**
     * 댓글 생성 요청 처리
     *
     * @param postId 댓글이 작성될 게시글 ID
     * @param comment 클라이언트로부터 전달받은 댓글 정보
     * @return 생성된 댓글 객체 반환
     */
    @PostMapping("/{postId}")
    public ResponseEntity<Comment> create(@PathVariable Long postId, @RequestBody Comment comment) {
        return ResponseEntity.ok(commentService.create(comment, postId));
    }

    /**
     * 댓글 수정 요청 처리
     *
     * @param id 수정할 댓글 ID
     * @param comment 수정할 내용이 담긴 댓글 객체
     * @return 수정된 댓글 객체 반환
     */
    @PutMapping("/{id}")
    public ResponseEntity<Comment> update(@PathVariable Long id, @RequestBody Comment comment) {
        return ResponseEntity.ok(commentService.update(id, comment));
    }

    /**
     * 댓글 삭제 요청 처리
     *
     * @param id 삭제할 댓글 ID
     * @return HTTP 204 No Content 응답 반환
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        commentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 특정 게시글에 대한 댓글 목록 조회
     *
     * @param postId 조회할 게시글 ID
     * @return 해당 게시글에 달린 댓글 목록 (DTO 형태)
     */
    @GetMapping
    public ResponseEntity<List<CommentResponseDto>> getByPostId(@RequestParam Long postId) {
        return ResponseEntity.ok(commentService.getByPostId(postId));
    }
}
