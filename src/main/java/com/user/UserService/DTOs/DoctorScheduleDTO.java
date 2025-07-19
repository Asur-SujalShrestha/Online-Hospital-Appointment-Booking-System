package com.user.UserService.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DoctorScheduleDTO {
    //Doctor Schedule Requirements
    private long doctorId;
    private String dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
}
