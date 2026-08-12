package com.eventhub;

import com.eventhub.dto.ApiDtos.EventRequest;
import com.eventhub.model.*;
import com.eventhub.repository.*;
import com.eventhub.service.EventService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@Transactional
class EventServiceTests {
    @Autowired EventService service;
    @Autowired UserRepository users;
    @Autowired EventRepository events;
    @Autowired RegistrationRepository registrations;

    @Test
    void registrationCannotExceedCapacity() {
        UserAccount first = users.save(new UserAccount("first@test.local", "unused", "First User", Role.USER));
        UserAccount second = users.save(new UserAccount("second@test.local", "unused", "Second User", Role.USER));
        Event event = events.save(new Event("Small workshop", "Test", "Room 1", LocalDateTime.now().plusDays(1), 1));

        service.register(event.getId(), principal(first));

        assertThatThrownBy(() -> service.register(event.getId(), principal(second)))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        ex -> assertThat(ex.getStatusCode()).isEqualTo(HttpStatus.CONFLICT));
        assertThat(registrations.countByEventId(event.getId())).isEqualTo(1);
    }

    @Test
    void duplicateRegistrationIsRejectedAndCancellationReleasesSpot() {
        UserAccount user = users.save(new UserAccount("duplicate@test.local", "unused", "Test User", Role.USER));
        Event event = events.save(new Event("Open event", "Test", "Room 2", LocalDateTime.now().plusDays(1), 5));
        Principal principal = principal(user);

        service.register(event.getId(), principal);
        assertThatThrownBy(() -> service.register(event.getId(), principal)).isInstanceOf(ResponseStatusException.class);

        service.cancel(event.getId(), principal);
        assertThat(registrations.existsByUserIdAndEventId(user.getId(), event.getId())).isFalse();
    }

    @Test
    void endedEventAutomaticallyClosesRegistration() {
        UserAccount user = users.save(new UserAccount("late@test.local", "unused", "Late User", Role.USER));
        Event event = events.save(new Event("Past event", "Test", "Room 3", LocalDateTime.now().minusMinutes(1), 20));

        assertThatThrownBy(() -> service.register(event.getId(), principal(user)))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        ex -> assertThat(ex.getReason()).isEqualTo("Registration has closed"));
    }

    @Test
    void adminCannotReduceCapacityBelowExistingRegistrations() {
        UserAccount user = users.save(new UserAccount("capacity@test.local", "unused", "Capacity User", Role.USER));
        Event event = events.save(new Event("Capacity event", "Test", "Room 4", LocalDateTime.now().plusDays(1), 2));
        service.register(event.getId(), principal(user));

        EventRequest invalid = new EventRequest("Capacity event", "Test", "Room 4", LocalDateTime.now().plusDays(1), 0);
        assertThatThrownBy(() -> service.update(event.getId(), invalid)).isInstanceOf(ResponseStatusException.class);
    }

    private Principal principal(UserAccount user) { return user::getEmail; }
}
