package com.appointmentBooking.AppointmentBooking.DTOs;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DoctorDTO {
    private long doctor_id;
    private long user;
    private String specialization;
    private String qualification;
    private int experience;
    private String status;
    private String bio;
}
