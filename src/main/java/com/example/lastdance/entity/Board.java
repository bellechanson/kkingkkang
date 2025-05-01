package com.example.lastdance.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "b_id")
    private Long bId;

    @Column(name = "category")
    private String category;
}
