package com.user.UserService.Services.Implementations;

import com.user.UserService.Config.JwtUtil;
import com.user.UserService.DTOs.LoginDTO;
import com.user.UserService.DTOs.RegisterResponseDTO;
import com.user.UserService.DTOs.ResponseDTO;
import com.user.UserService.DTOs.UserDTO;
import com.user.UserService.Services.IAuthService;
import com.user.UserService.entities.DoctorSchedule;
import com.user.UserService.entities.Doctors;
import com.user.UserService.entities.Patients;
import com.user.UserService.entities.Users;
import com.user.UserService.repositories.AuthRepository;
import com.user.UserService.repositories.DoctorRepository;
import com.user.UserService.repositories.DoctorScheduleRepository;
import com.user.UserService.repositories.PatientRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Collections;

@Service
public class AuthService implements IAuthService{
    private final AuthRepository authRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final DoctorRepository doctorRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final PatientRepository patientRepository;
    private final EmailService emailService;

    public AuthService(AuthRepository authRepository, BCryptPasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtil jwtUtil, DoctorRepository doctorRepository, DoctorScheduleRepository doctorScheduleRepository, PatientRepository patientRepository, EmailService emailService) {
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.doctorRepository = doctorRepository;
        this.doctorScheduleRepository = doctorScheduleRepository;
        this.patientRepository = patientRepository;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public RegisterResponseDTO registerUser(UserDTO userDto) throws BadRequestException {
       Users user = authRepository.findByEmail(userDto.getEmail());
        if (user != null) {
            throw new BadRequestException("User already exist");
        }

        Users newUser = Users.builder()
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .email(userDto.getEmail())
                .dob(userDto.getDob())
                .phone(userDto.getPhone())
                .gender(userDto.getGender())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .role(Enum.valueOf(Users.Roles.class, userDto.getRole()))
                .build();

        authRepository.save(newUser);

        if(userDto.getRole().equalsIgnoreCase("DOCTORS")){
            Doctors doctors = Doctors.builder()
                    .user(newUser)
                    .specialization(userDto.getSpecialization())
                    .qualification(userDto.getQualification())
                    .experience(userDto.getExperience())
                    .status(Doctors.Status.PENDING)
                    .bio(userDto.getBio())
                    .build();

            doctorRepository.save(doctors);
            emailService.RegisterDoctor(userDto.getEmail());

        }
        else if(userDto.getRole().equalsIgnoreCase("PATIENTS")){
            Patients patients = Patients.builder()
                    .user(newUser)
                    .bloodGroup(userDto.getBloodGroup())
                    .medicalNotes(userDto.getMedicalNotes())
                    .allergies(userDto.getAllergies())
                    .build();

            patientRepository.save(patients);
        }

        return RegisterResponseDTO.builder().firstName(newUser.getFirstName())
                .lastName(newUser.getLastName())
                .email(newUser.getEmail())
                .build();
    }

    @Override
    public ResponseDTO loginUser(LoginDTO loginDTO) throws BadRequestException {
        Users user = authRepository.findByEmail(loginDTO.getEmail());
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new BadRequestException("Password does not match");
        }
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword()));
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return jwtUtil.generateToken(userDetails.getUsername(), user);
    }

    @ExceptionHandler(BadRequestException.class)
    public String exceptionHandler(){
        return "User Already Exist";
    }

}
