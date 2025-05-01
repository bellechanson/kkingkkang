//package com.example.lastdance.config;
//
//import com.example.lastdance.entity.Board;
//import com.example.lastdance.entity.Post;
//import com.example.lastdance.repository.BoardRepository;
//import com.example.lastdance.repository.PostRepository;
//import jakarta.annotation.PostConstruct;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import net.datafaker.Faker;
//import org.springframework.stereotype.Component;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Locale;
//@Component // 또는 @Configuration
//@RequiredArgsConstructor
//public class DummyDataLoader {
//
//    private final PostRepository postRepository;
//    private final BoardRepository boardRepository;
//
//    private final Faker faker = new Faker(new Locale("ko"));
//
//    @PostConstruct
//    @Transactional
//    public void init() {
//        Long boardId = 1L;
//        int count = 100000;
//        int batchSize = 1000;
//
//        Board board = boardRepository.findById(boardId)
//                .orElseThrow(() -> new IllegalArgumentException("Board not found"));
//
//        List<Post> batch = new ArrayList<>();
//
//        for (int i = 1; i <= count; i++) {
//            Post post = Post.builder()
//                    .title(faker.book().title())
//                    .content(faker.lorem().paragraph(3))
//                    .nickname(faker.name().username())
//                    .authorId((long) faker.number().numberBetween(1, 1000))
//                    .board(board)
//                    .viewCount(faker.number().numberBetween(0, 100))
//                    .build();
//
//            batch.add(post);
//
//            if (i % batchSize == 0) {
//                postRepository.saveAll(batch);
//                postRepository.flush(); // (optional) 즉시 insert
//                batch.clear();
//                System.out.println(i + "건 배치 저장 완료");
//            }
//        }
//
//        // 남은 데이터 저장
//        if (!batch.isEmpty()) {
//            postRepository.saveAll(batch);
//            System.out.println("남은 데이터 " + batch.size() + "건 저장 완료");
//        }
//
//        System.out.println("총 " + count + "건의 게시글 생성 완료!");
//    }
//}