package com.eventhub.config;

import com.eventhub.model.Event;
import com.eventhub.model.Role;
import com.eventhub.model.UserAccount;
import com.eventhub.model.TicketType;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.UserRepository;
import com.eventhub.repository.TicketTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Configuration
public class DataSeeder {
    @Bean @Order(2) CommandLineRunner seed(UserRepository users, EventRepository events, TicketTypeRepository ticketTypes, PasswordEncoder encoder) {
        return args -> {
            if (users.count() == 0) {
                users.save(new UserAccount("user@event.local", encoder.encode("password"), "Mali Srisuk", Role.USER));
                users.save(new UserAccount("staff@event.local", encoder.encode("staff123"), "Suda Check-in", Role.STAFF));
                users.save(new UserAccount("admin@event.local", encoder.encode("admin123"), "Narin Admin", Role.ADMIN));
            }
            if (users.findByEmail("staff@event.local").isEmpty()) {
                users.save(new UserAccount("staff@event.local", encoder.encode("staff123"), "Suda Check-in", Role.STAFF));
            }
            if (events.count() == 0) {
                events.save(event("Designing for Real People", "A practical workshop on turning research insights into interfaces people can understand and trust.", "Creative Hall, Building A", LocalDateTime.now().plusDays(6).withHour(10).withMinute(0), 40, "DESIGN",
                        "Student", "For current students", "0", 25, "Public", "Includes workshop materials", "290", 15));
                events.save(event("Spring Boot at Scale", "Build reliable services with transaction boundaries, observability, and pragmatic architecture.", "Engineering Lab 3", LocalDateTime.now().plusDays(12).withHour(13).withMinute(30), 60, "TECH",
                        "Early bird", "Limited launch price", "390", 20, "General", "Full conference access", "590", 40));
                events.save(event("Campus Product Night", "Student teams share prototypes, lessons learned, and the decisions behind their products.", "Main Auditorium", LocalDateTime.now().plusDays(18).withHour(17).withMinute(30), 120, "CAREER",
                        "Community", "Open seating", "0", 90, "Supporter", "Priority seating and event pack", "250", 30));
                events.save(event("Accessibility Testing Lab", "Bring your interface and learn a repeatable keyboard, screen-reader, and contrast testing workflow.", "Digital Studio 2", LocalDateTime.now().plusDays(25).withHour(9).withMinute(0), 24, "COMMUNITY",
                        "Lab seat", "Bring your own project", "180", 18, "Observer", "Watch the testing session", "80", 6));
            }
            // Keep existing local demo data usable after the ticketing upgrade.
            events.findAll().stream().filter(event -> !ticketTypes.existsByEventId(event.getId())).forEach(event -> {
                ticketTypes.save(new TicketType(event, "General admission", "Standard entry", BigDecimal.ZERO, event.getCapacity()));
            });
            // Convert the pre-ticketing demo events into a usable two-tier catalog without deleting old registrations.
            events.findAll().forEach(event -> {
                var types = ticketTypes.findByEventIdOrderByIdAsc(event.getId());
                if (types.size() == 1 && types.getFirst().getName().equals("General admission") && types.getFirst().getPrice().compareTo(BigDecimal.ZERO) == 0 && event.getCapacity() > 1) {
                    int communityQuota = Math.min(8, event.getCapacity() - 1);
                    types.getFirst().update("Community", "Standard entry", BigDecimal.ZERO, communityQuota);
                    ticketTypes.save(types.getFirst());
                    ticketTypes.save(new TicketType(event, "Supporter", "Priority entry and event materials", new BigDecimal("290"), event.getCapacity() - communityQuota));
                }
                String category = switch (event.getTitle()) {
                    case "Designing for Real People" -> "DESIGN";
                    case "Spring Boot at Scale" -> "TECH";
                    case "Campus Product Night" -> "CAREER";
                    default -> "COMMUNITY";
                };
                if (!category.equals(event.getCategory())) { event.setCategory(category); events.save(event); }
            });
        };
    }
    private Event event(String title, String description, String location, LocalDateTime startsAt, int capacity, String category,
                        String firstName, String firstDescription, String firstPrice, int firstCapacity,
                        String secondName, String secondDescription, String secondPrice, int secondCapacity) {
        Event event = new Event(title, description, location, startsAt, capacity, category);
        event.addTicketType(firstName, firstDescription, new BigDecimal(firstPrice), firstCapacity);
        event.addTicketType(secondName, secondDescription, new BigDecimal(secondPrice), secondCapacity);
        return event;
    }
}
