package com.eventhub.config;

import com.eventhub.model.Event;
import com.eventhub.model.Role;
import com.eventhub.model.UserAccount;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;

@Configuration
public class DataSeeder {
    @Bean CommandLineRunner seed(UserRepository users, EventRepository events, PasswordEncoder encoder) {
        return args -> {
            if (users.count() == 0) {
                users.save(new UserAccount("user@event.local", encoder.encode("password"), "Mali Srisuk", Role.USER));
                users.save(new UserAccount("admin@event.local", encoder.encode("admin123"), "Narin Admin", Role.ADMIN));
            }
            if (events.count() == 0) {
                events.save(new Event("Designing for Real People", "A practical workshop on turning research insights into interfaces people can understand and trust.", "Creative Hall, Building A", LocalDateTime.now().plusDays(6).withHour(10).withMinute(0), 40));
                events.save(new Event("Spring Boot at Scale", "Build reliable services with transaction boundaries, observability, and pragmatic architecture.", "Engineering Lab 3", LocalDateTime.now().plusDays(12).withHour(13).withMinute(30), 60));
                events.save(new Event("Campus Product Night", "Student teams share prototypes, lessons learned, and the decisions behind their products.", "Main Auditorium", LocalDateTime.now().plusDays(18).withHour(17).withMinute(30), 120));
                events.save(new Event("Accessibility Testing Lab", "Bring your interface and learn a repeatable keyboard, screen-reader, and contrast testing workflow.", "Digital Studio 2", LocalDateTime.now().plusDays(25).withHour(9).withMinute(0), 24));
            }
        };
    }
}
