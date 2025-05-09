package com.example.lastdance.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity // JPA 엔티티로 등록
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Access(AccessType.FIELD) // 필드 기반 접근 (getter/setter가 아닌 실제 필드 기준으로 JPA 동작)
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 ID
    private Long pId; // 게시글 ID (기본 키)

    @Column(nullable = false)
    private String title; // 게시글 제목

    @Column(nullable = false, columnDefinition = "TEXT") // 내용이 길 수 있으므로 TEXT로 설정
    private String content; // 게시글 본문 내용

    @Column(nullable = true)
    private Long authorId; // 작성자 ID (User 테이블과 연동을 위한 참조)

    @Column(nullable = false)
    private String nickname; // 작성자의 닉네임

    private LocalDateTime createdAt; // 생성일시
    private LocalDateTime updatedAt; // 수정일시

    @PrePersist // 엔티티 저장 전 자동 실행
    public void onCreate() {
        this.createdAt = LocalDateTime.now(); // 생성 시간 저장
        this.updatedAt = LocalDateTime.now(); // 수정 시간도 최초엔 생성 시간과 동일하게 설정
    }

    @ManyToOne // 게시글은 하나의 게시판(Board)에 속함
    @JoinColumn(name = "board_id", nullable = true) // 외래 키: board_id
    private Board board; // 소속 게시판 정보

    @Column(nullable = false)
    private Integer viewCount = 0; // 기본 조회수 0으로 초기화

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();
    // 하나의 게시글은 여러 댓글을 가짐
    // mappedBy = "post" → Comment 엔티티의 post 필드가 연관관계 주인
    // cascade = ALL → 게시글 삭제 시 관련 댓글들도 자동 삭제
    // orphanRemoval = true → 댓글이 리스트에서 제거되면 DB에서도 삭제
}