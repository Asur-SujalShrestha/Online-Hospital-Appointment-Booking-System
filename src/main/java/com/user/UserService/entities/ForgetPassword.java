package com.user.UserService.entities;

import jakarta.persistence.*;
import lombok.*;
import org.checkerframework.common.aliasing.qual.Unique;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ForgetPassword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "UserId", nullable = false)
    private Users user;

    @Column(unique = true, nullable = false)
    private int token;

    private LocalDateTime expires;
}
