package com.example.lastdance.service;

import com.example.lastdance.dto.CommentResponseDto;
import com.example.lastdance.entity.Comment;
import com.example.lastdance.entity.Post;
import com.example.lastdance.repository.CommentRepository;
import com.example.lastdance.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public Comment create(Comment comment, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        comment.setPost(post);
        return commentRepository.save(comment);
    }

    public Comment update(Long id, Comment updated) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        comment.setContent(updated.getContent());
        return commentRepository.save(comment);
    }

    public void delete(Long id) {
        commentRepository.deleteById(id);
    }

    public List<CommentResponseDto> getByPostId(Long postId) {
        return commentRepository.findAll().stream()
                .filter(c -> c.getPost().getPId().equals(postId))
                .map(c -> CommentResponseDto.builder()
                        .postId(c.getPost().getPId())
                        .authorId(c.getAuthorId())
                        .content(c.getContent())
                        .createdAt(c.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
