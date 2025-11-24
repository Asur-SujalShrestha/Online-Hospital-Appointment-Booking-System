package com.appointmentBooking.AppointmentBooking.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String gender;
    private LocalDate dob;
    private String phone;
    private String role;
    private DoctorDTO doctor;
}
