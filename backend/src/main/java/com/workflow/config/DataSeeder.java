package com.workflow.config;

import com.workflow.model.Role;
import com.workflow.model.User;
import com.workflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@workflow.com")) {
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@workflow.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
        }
        
        if (!userRepository.existsByEmail("manager@workflow.com")) {
            User manager = User.builder()
                    .name("Manager User")
                    .email("manager@workflow.com")
                    .password(passwordEncoder.encode("manager123"))
                    .role(Role.MANAGER)
                    .build();
            userRepository.save(manager);
        }
    }
}
