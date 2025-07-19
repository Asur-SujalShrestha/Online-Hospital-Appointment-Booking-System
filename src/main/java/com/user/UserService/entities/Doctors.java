package com.user.UserService.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;


@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Doctors {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long doctor_id;

    @JoinColumn(name = "user_Id")
    @JsonBackReference("doctor")
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Users user;

    private String specialization;
    private String qualification;
    private int experience;
    private Status status;
    @Column(nullable = true)
    @Size(max = 150, message = "Bio should not exceed 150 characters")
    private String bio;

    public enum Status {
        APPROVE, PENDING, REJECTED
    }
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("doctor_schedule")
    private List<DoctorSchedule> schedule;
}
