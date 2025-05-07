package com.example.lastdance.controller;

import com.example.lastdance.entity.Post;
import com.example.lastdance.service.PostService;
import com.example.lastdance.dto.PostResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    /**
     * 게시글 생성 - 특정 게시판(boardId)에 속한 게시글 작성
     * ex) POST /api/boards/posts/create/{boardId}
     */
    @PostMapping("/create/{boardId}")
    public ResponseEntity<Post> create(@PathVariable Long boardId, @RequestBody Post post) {
        return ResponseEntity.ok(postService.create(post, boardId));
    }

    /**
     * 게시글 수정
     * ex) PUT /api/boards/posts/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Post> update(@PathVariable Long id, @RequestBody Post post) {
        return ResponseEntity.ok(postService.update(id, post));
    }

    /**
     * 게시글 삭제
     * ex) DELETE /api/boards/posts/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 게시글 상세 조회
     * ex) GET /api/boards/posts/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getById(id));
    }

    /**
     * 특정 게시판(boardId)에 속한 모든 게시글 조회 (페이징 없이 전체 조회)
     * ex) GET /api/boards/posts?boardId=1
     */
    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAllByBoard(@RequestParam Long boardId) {
        return ResponseEntity.ok(postService.getAllByBoard(boardId));
    }

    /**
     * 전체 게시글을 페이지 단위로 조회
     * ex) GET /api/boards/posts/paged?page=0&size=10
     */
    @GetMapping("/paged")
    public ResponseEntity<Page<PostResponseDto>> getAllPaged(Pageable pageable) {
        return ResponseEntity.ok(postService.getAllPaged(pageable));
    }

    /**
     * 전체 게시글을 페이지 단위로 조회 (추가 목적 분리용)
     * ex) GET /api/boards/posts/all?page=0&size=10
     */
    @GetMapping("/all")
    public ResponseEntity<Page<PostResponseDto>> getAllPosts(Pageable pageable) {
        return ResponseEntity.ok(postService.getAllPosts(pageable));
    }

    @GetMapping("/by-board/{boardId}")
    public ResponseEntity<Page<PostResponseDto>> getPostsByBoard(
            @PathVariable Long boardId,
            Pageable pageable
    ) {
        return ResponseEntity.ok(postService.getPostsByBoard(boardId, pageable));
    }

    @GetMapping("/{id}/view")
    public ResponseEntity<PostResponseDto> getByIdAndIncreaseView(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getByIdAndIncreaseView(id));
    }


}
