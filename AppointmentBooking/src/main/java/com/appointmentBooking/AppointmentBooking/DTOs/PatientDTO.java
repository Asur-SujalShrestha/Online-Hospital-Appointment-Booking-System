package com.appointmentBooking.AppointmentBooking.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PatientDTO {
    private long patient_id;
    private long user;
    private String bloodGroup;
    private String medicalNotes;
    private String allergies;
}
