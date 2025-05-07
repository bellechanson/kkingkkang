package com.example.lastdance.service;

import com.example.lastdance.entity.Board;
import com.example.lastdance.entity.Post;
import com.example.lastdance.repository.BoardRepository;
import com.example.lastdance.repository.PostRepository;
import com.example.lastdance.dto.PostResponseDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final BoardRepository boardRepository;

    // 게시글 생성
    public Post create(Post post, Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found"));
        post.setBoard(board);
        return postRepository.save(post);
    }

    // 게시글 수정
    public Post update(Long id, Post updated) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        post.setTitle(updated.getTitle());
        post.setContent(updated.getContent());
        return postRepository.save(post);
    }

    // 게시글 삭제
    public void delete(Long id) {
        postRepository.deleteById(id);
    }

    // 게시판 기준 전체 게시글 조회 (비페이징)
    public List<PostResponseDto> getAllByBoard(Long boardId) {
        return postRepository.findAll().stream()
                .filter(post -> post.getBoard().getBId().equals(boardId))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // 게시글 상세 조회
    public PostResponseDto getById(Long id) {
        return postRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
    }

    // 전체 게시글 페이징
    public Page<PostResponseDto> getAllPosts(Pageable pageable) {
        Page<Post> postPage = postRepository.findAll(pageable);
        List<PostResponseDto> dtoList = postPage.getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, pageable, postPage.getTotalElements());
    }

    // 페이징 처리된 게시글 조회
    public Page<PostResponseDto> getAllPaged(Pageable pageable) {
        return postRepository.findAll(pageable)
                .map(this::toDto);
    }

    public Page<PostResponseDto> getPostsByBoard(Long boardId, Pageable pageable) {
        return postRepository.findAllByBoard_bId(boardId, pageable)
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
                        .build());
    }

    // Post → PostResponseDto 변환 메서드
    private PostResponseDto toDto(Post post) {
        return PostResponseDto.builder()
                .id(post.getPId())
                .title(post.getTitle())
                .content(post.getContent())
                .authorId(post.getAuthorId())
                .nickname(post.getNickname())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .viewCount(post.getViewCount())
                .boardId(post.getBoard().getBId())
                .build();
    }

    @Transactional
    public PostResponseDto getByIdAndIncreaseView(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        post.setViewCount(post.getViewCount() + 1); // 조회수 증가
        return toDto(post); // 변경된 post를 DTO로 반환
    }

}
