package com.user.UserService.DTOs;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DoctorDTO {
    private long doctor_id;
    private long user;
    private String specialization;
    private String qualification;
    private int experience;
    private String status;
    private String bio;
}
