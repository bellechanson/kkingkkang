package com.example.lastdance.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity // JPA 엔티티로 등록
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 ID
    private Long cId; // 댓글 ID (기본 키)

    @ManyToOne // 다대일 관계: 여러 댓글이 하나의 게시글(Post)에 연결됨
    @JsonIgnore // 직렬화 시 무한 루프 방지: 댓글 → 게시글 정보는 JSON 응답에 포함하지 않음
    @JoinColumn(name = "post_id", nullable = false) // 외래 키(post_id)로 Post 엔티티 참조
    private Post post; // 댓글이 속한 게시글

    @Column(nullable = false)
    private Long authorId; // 댓글 작성자 ID (User 엔티티 참조용)

    @Column(nullable = false, columnDefinition = "TEXT") // 내용이 길어질 수 있으므로 TEXT 타입 사용
    private String content; // 댓글 내용

    private LocalDateTime createdAt = LocalDateTime.now(); // 댓글 작성 시간 (기본값: 현재 시간)
}
