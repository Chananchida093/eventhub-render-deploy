package com.eventhub;

import com.eventhub.dto.ApiDtos.EventRequest;
import com.eventhub.dto.ApiDtos.EventPageDto;
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

        EventRequest invalid = new EventRequest("Capacity event", "Test", "Room 4", LocalDateTime.now().plusDays(1), 0, "TECH", null, null, java.util.List.of(new com.eventhub.dto.ApiDtos.TicketTypeRequest(null, "General", "", java.math.BigDecimal.ZERO, 1)));
        assertThatThrownBy(() -> service.update(event.getId(), invalid)).isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void eventListUsesOnePaginatedProjectionWithRegistrationState() {
        UserAccount user = users.save(new UserAccount("list@test.local", "unused", "List User", Role.USER));
        Event first = events.save(new Event("NPlusOne regression workshop", "Architecture", "Lab", LocalDateTime.now().plusDays(2), 5));
        events.save(new Event("Pagination regression workshop", "Interfaces", "Studio", LocalDateTime.now().plusDays(3), 5));
        service.register(first.getId(), principal(user));

        EventPageDto result = service.list(principal(user), 0, 1, "nplusone", "ALL", "ALL");

        assertThat(result.items()).hasSize(1);
        assertThat(result.totalElements()).isEqualTo(1);
        assertThat(result.totalPages()).isEqualTo(1);
        assertThat(result.items().getFirst().registered()).isTrue();
        assertThat(result.items().getFirst().registeredCount()).isEqualTo(1);
    }

    @Test
    void eventListFiltersOpenEventsOnTheServer() {
        Event open = events.save(new Event("Open event", "Test", "Room", LocalDateTime.now().plusDays(1), 2));
        Event ended = events.save(new Event("Ended event", "Test", "Room", LocalDateTime.now().minusMinutes(1), 2));

        EventPageDto result = service.list(null, 0, 20, "", "ALL", "OPEN");

        assertThat(result.items()).extracting(item -> item.id()).contains(open.getId());
        assertThat(result.items()).extracting(item -> item.id()).doesNotContain(ended.getId());
    }

    private Principal principal(UserAccount user) { return user::getEmail; }
}
