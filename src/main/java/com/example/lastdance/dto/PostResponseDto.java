package com.example.lastdance.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class PostResponseDto {

    private Long id;
    private String title;
    private String content;
    private Long authorId;
    private String nickname;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long boardId;
    private Integer viewCount;
}