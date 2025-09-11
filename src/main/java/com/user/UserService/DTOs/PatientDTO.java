package com.user.UserService.DTOs;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PatientDTO {
    private long patient_id;
    private long user;
    private String bloodGroup;
    private String medicalNotes;
    private String allergies;
}