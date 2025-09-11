package com.appointmentBooking.AppointmentBooking.Services.Implementations;

import com.appointmentBooking.AppointmentBooking.DTOs.*;
import com.appointmentBooking.AppointmentBooking.Entities.Appointments;
import com.appointmentBooking.AppointmentBooking.Repositories.AppointmentRepository;
import com.appointmentBooking.AppointmentBooking.Services.DoctorClient;
import com.appointmentBooking.AppointmentBooking.Services.IAppointmentService;
import com.appointmentBooking.AppointmentBooking.Services.PrescriptionClient;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
public class AppointmentService implements IAppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final DoctorClient doctorClient;
    private final PrescriptionClient prescriptionClient;
    private final EmailService emailService;

    public AppointmentService(AppointmentRepository appointmentRepository, DoctorClient doctorClient, PrescriptionClient prescriptionClient, EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorClient = doctorClient;
        this.prescriptionClient = prescriptionClient;
        this.emailService = emailService;
    }

    @Override
    public AddedAppointmentResponse addAppointment(AddAppointmentDTO appointmentDto) throws BadRequestException {
        DoctorDTO doctorDTO = doctorClient.getDoctor(appointmentDto.getDoctorId());
        UserDTO userDTO = doctorClient.getUserByEmail(appointmentDto.getPatientEmail());
        if(userDTO == null) {
            throw new BadRequestException("User not found");
        }
        if(doctorDTO == null) {
            throw new BadRequestException("Doctor not found");
        }

        if(!doctorClient.isPatientExist(appointmentDto.getPatientId())) {
            throw new BadRequestException("Patient not found");
        }

        Appointments bookedAppointment = appointmentRepository.findByDoctorIdAndAppointmentDateAndAppointmentTime(appointmentDto.getDoctorId(), appointmentDto.getAppointmentDate(), appointmentDto.getAppointmentTime());
        if(bookedAppointment != null) {
            throw new BadRequestException("This time slot is already booked for the doctor");
        }
        Appointments newAppointment = Appointments.builder()
                .doctorId(appointmentDto.getDoctorId())
                .appointmentDate(appointmentDto.getAppointmentDate())
                .appointmentTime(appointmentDto.getAppointmentTime())
                .notes(appointmentDto.getNotes())
                .patientId(appointmentDto.getPatientId())
                .bookedAt(LocalDateTime.now())
                .status(Appointments.Status.PENDING)
                .build();

        appointmentRepository.save(newAppointment);
        emailService.addAppointment(userDTO.getEmail(), newAppointment);
        return AddedAppointmentResponse.builder()
                .doctorId(newAppointment.getDoctorId())
                .patientId(newAppointment.getPatientId())
                .appointmentDate(newAppointment.getAppointmentDate())
                .appointmentTime(newAppointment.getAppointmentTime())
                .bookedAt(newAppointment.getBookedAt())
                .status(String.valueOf(newAppointment.getStatus()))
                .build();
    }

    @Override
    public List<GetAppointmentDTO> getAllAppointments() {
        List<Appointments> appointmentsList = appointmentRepository.findAll();
        return appointmentsList.stream()
                .map(appointment -> {
                    // Fetch patient info
                    PatientDTO patient = doctorClient.getPatientById(appointment.getPatientId());
                    UserDTO patientUser = doctorClient.getUserById(patient.getUser());
                    String patientName =patientUser.getFirstName() + " " + patientUser.getLastName();

                    // Fetch doctor info
                    DoctorDTO doctor = doctorClient.getDoctor(appointment.getDoctorId());
                    UserDTO doctorUser = doctorClient.getUserById(doctor.getUser());
                    String doctorName = doctorUser.getFirstName() + " " + doctorUser.getLastName();

                    //Fetch prescription list
                    List<Prescriptions> prescriptions = prescriptionClient.getPrescriptionByAppointment(appointment.getAppointmentId());
                    // Build DTO
                    return GetAppointmentDTO.builder()
                            .appointmentId(appointment.getAppointmentId())
                            .doctorId(appointment.getDoctorId())
                            .doctorName(doctorName)
                            .patientId(appointment.getPatientId())
                            .patientName(patientName)
                            .appointmentDate(appointment.getAppointmentDate())
                            .appointmentTime(appointment.getAppointmentTime())
                            .bookedAt(appointment.getBookedAt())
                            .notes(appointment.getNotes())
                            .status(appointment.getStatus().toString())
                            .prescriptions(prescriptions)
                            .build();
                })
                .toList();
    }

    @Override
    public List<GetAppointmentDTO> getAppointmentByDoctorId(Long doctorId) throws BadRequestException {
        DoctorDTO doctorDTO = doctorClient.getDoctor(doctorId);
        if(doctorDTO == null) {
            throw new BadRequestException("Doctor not found");
        }
        List<Appointments> appointmentsList = appointmentRepository.findByDoctorId(doctorId);

        return appointmentsList.stream()
                .map(appointment -> {
                    // Fetch patient info
                    PatientDTO patient = doctorClient.getPatientById(appointment.getPatientId());
                    UserDTO patientUser = doctorClient.getUserById(patient.getUser());
                    String patientName =patientUser.getFirstName() + " " + patientUser.getLastName();

                    // Fetch doctor info
                    DoctorDTO doctor = doctorClient.getDoctor(appointment.getDoctorId());
                    UserDTO doctorUser = doctorClient.getUserById(doctor.getUser());
                    String doctorName = doctorUser.getFirstName() + " " + doctorUser.getLastName();

                    //Fetch prescription list
                    List<Prescriptions> prescriptions = prescriptionClient.getPrescriptionByAppointment(appointment.getAppointmentId());
                    // Build DTO
                    return GetAppointmentDTO.builder()
                            .appointmentId(appointment.getAppointmentId())
                            .doctorId(appointment.getDoctorId())
                            .doctorName(doctorName)
                            .patientId(appointment.getPatientId())
                            .patientName(patientName)
                            .appointmentDate(appointment.getAppointmentDate())
                            .appointmentTime(appointment.getAppointmentTime())
                            .bookedAt(appointment.getBookedAt())
                            .notes(appointment.getNotes())
                            .status(appointment.getStatus().toString())
                            .prescriptions(prescriptions)
                            .build();
                })
                .toList(); // Java 16+ (or use .collect(Collectors.toList()) for older version
    }

    @Override
    public List<Appointments> getAppointmentByPatientId(Long patientId) throws BadRequestException {
        if(!doctorClient.isPatientExist(patientId)){
            throw new BadRequestException("Patient not found");
        }
        List<Appointments> appointmentsList = appointmentRepository.findByPatientId(patientId);
        return appointmentsList.stream().map(appointments -> {
            appointments.setPrescriptions(prescriptionClient.getPrescriptionByAppointment(appointments.getAppointmentId()));
            return appointments;
        }).collect(Collectors.toList());
    }

    @Override
    public boolean checkAppointment(Long appointmentId) {
        Appointments appointments = appointmentRepository.findById(appointmentId).orElse(null);
        return appointments != null;
    }

    @Override
    public String updateAppointment(Long appointmentId, UpdateAppointmentDTO updateAppointmentDTO) throws BadRequestException {
        Appointments appointments = appointmentRepository.findById(appointmentId).orElseThrow(()-> new BadRequestException("Appointment not found"));
        appointments.setAppointmentDate(updateAppointmentDTO.getAppointmentDate());
        appointments.setAppointmentTime(updateAppointmentDTO.getAppointmentTime());
        appointmentRepository.save(appointments);
        return "Appointment Updated Successfully";
    }

    @Override
    public String deleteAppointment(Long appointmentId) throws BadRequestException {
        Appointments appointment = appointmentRepository.findById(appointmentId).orElseThrow(()-> new BadRequestException("Appointment not found"));
        appointmentRepository.delete(appointment);
        return "Appointment Deleted Successfully";
    }

    @Override
    public String updateAppointmentStatus(Long appointmentId, String status) throws BadRequestException {
        Appointments appointment = appointmentRepository.findById(appointmentId).orElseThrow(()-> new BadRequestException("Appointment not found"));
        appointment.setStatus(Enum.valueOf(Appointments.Status.class, status.toUpperCase()));
        appointmentRepository.save(appointment);
        return "Appointment Updated Successfully";
    }


}
