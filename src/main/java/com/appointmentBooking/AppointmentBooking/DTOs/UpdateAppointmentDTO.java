package com.appointmentBooking.AppointmentBooking.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateAppointmentDTO {
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
}
