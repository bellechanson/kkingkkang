//package com.example.lastdance.controller;
//
//import com.example.lastdance.search.PostDocument;
//import com.example.lastdance.search.PostSearchRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/search")
//@RequiredArgsConstructor
//public class PostSearchController {
//
//    private final PostSearchRepository postSearchRepository;
//
//    @GetMapping
//    public List<PostDocument> search(@RequestParam String keyword) {
//        return postSearchRepository.findByTitleContainingOrContentContaining(keyword, keyword);
//    }
//
//}
