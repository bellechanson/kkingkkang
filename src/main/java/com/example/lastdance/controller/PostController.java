package com.example.lastdance.controller;

import com.example.lastdance.entity.Post;
import com.example.lastdance.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.lastdance.dto.PostResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/boards/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/paged")
    public ResponseEntity<Page<PostResponseDto>> getAllPaged(Pageable pageable) {
        return ResponseEntity.ok(postService.getAllPaged(pageable));
    }

    @PostMapping("/{boardId}")
    public ResponseEntity<Post> create(@PathVariable Long boardId, @RequestBody Post post) {
        return ResponseEntity.ok(postService.create(post, boardId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> update(@PathVariable Long id, @RequestBody Post post) {
        return ResponseEntity.ok(postService.update(id, post));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getAllByBoard(@RequestParam Long boardId) {
        return ResponseEntity.ok(postService.getAllByBoard(boardId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<Page<PostResponseDto>> getAllPosts(Pageable pageable) {
        return ResponseEntity.ok(postService.getAllPosts(pageable));
    }
}
