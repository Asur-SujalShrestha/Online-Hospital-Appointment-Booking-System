package com.user.UserService.DTOs;

import com.user.UserService.entities.Doctors;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDTO {

    //Users Requirements
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String confirmPassword;
    private String gender;
    private LocalDate dob;
    private String phone;
    private String role;

    //Doctors Requirements
    private String specialization;
    private String qualification;
    private int experience;
    private String bio;



    //Patients Requirements
    private String bloodGroup;
    private String medicalNotes;
    private String allergies;
}
