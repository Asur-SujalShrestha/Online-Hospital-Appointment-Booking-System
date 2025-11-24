package com.appointmentBooking.AppointmentBooking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class AppointmentBookingApplication {

	public static void main(String[] args) {
		SpringApplication.run(AppointmentBookingApplication.class, args);
	}

}
