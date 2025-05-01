package com.example.lastdance.service;

import com.example.lastdance.entity.Board;
import com.example.lastdance.entity.Post;
import com.example.lastdance.repository.BoardRepository;
import com.example.lastdance.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import com.example.lastdance.dto.PostResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final BoardRepository boardRepository;

    public Post create(Post post, Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found"));
        post.setBoard(board);
        return postRepository.save(post);
    }

    public Post update(Long id, Post updated) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        post.setTitle(updated.getTitle());
        post.setContent(updated.getContent());

        return postRepository.save(post);
    }

    public void delete(Long id) {
        postRepository.deleteById(id);
    }
    public List<PostResponseDto> getAllByBoard(Long boardId) {
        return postRepository.findAll().stream()
                .filter(post -> post.getBoard().getBId().equals(boardId))
                .map(post -> PostResponseDto.builder()
                        .id(post.getPId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .authorId(post.getAuthorId())
                        .nickname(post.getNickname())
                        .createdAt(post.getCreatedAt())
                        .updatedAt(post.getUpdatedAt())
                        .viewCount(post.getViewCount())
                        .boardId(post.getBoard().getBId())
                        .build()
                ).collect(Collectors.toList());
    }

    public PostResponseDto getById(Long id) {
        return postRepository.findById(id)
                .map(post -> PostResponseDto.builder()
                        .id(post.getPId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .authorId(post.getAuthorId())
                        .nickname(post.getNickname()) // 추가
                        .createdAt(post.getCreatedAt())
                        .updatedAt(post.getUpdatedAt())
                        .viewCount(post.getViewCount())
                        .boardId(post.getBoard().getBId())
                        .build())
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
    }

    public Page<PostResponseDto> getAllPosts(Pageable pageable) {
        Page<Post> postPage = postRepository.findAll(pageable);

        // Post → PostResponseDto 변환
        List<PostResponseDto> dtoList = postPage.getContent().stream()
                .map(post -> PostResponseDto.builder()
                        .id(post.getPId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .authorId(post.getAuthorId())
                        .nickname(post.getNickname())
                        .createdAt(post.getCreatedAt())
                        .updatedAt(post.getUpdatedAt())
                        .viewCount(post.getViewCount())
                        .boardId(post.getBoard().getBId())
                        .build())
                .collect(Collectors.toList());

        // 다시 Page<PostResponseDto>로 감싸서 리턴
        return new PageImpl<>(dtoList, pageable, postPage.getTotalElements());
    }

    public Page<PostResponseDto> getAllPaged(Pageable pageable) {
        return postRepository.findAll(pageable)
                .map(post -> PostResponseDto.builder()
                        .id(post.getPId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .authorId(post.getAuthorId())
                        .nickname(post.getNickname())   // 추가
                        .createdAt(post.getCreatedAt())
                        .updatedAt(post.getUpdatedAt())
                        .viewCount(post.getViewCount())
                        .boardId(post.getBoard().getBId())
                        .build());
    }
}
