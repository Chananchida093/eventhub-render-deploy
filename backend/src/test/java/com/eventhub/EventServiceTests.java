package com.eventhub;

import com.eventhub.dto.ApiDtos.EventRequest;
import com.eventhub.dto.ApiDtos.EventPageDto;
import com.eventhub.dto.ApiDtos.PurchaseRequest;
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
import java.math.BigDecimal;

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

        EventRequest invalid = new EventRequest("Capacity event", "Test", "Room 4", LocalDateTime.now().plusDays(1), 0, "TECH", null, java.util.List.of(), java.util.List.of(new com.eventhub.dto.ApiDtos.TicketTypeRequest(null, "General", "", java.math.BigDecimal.ZERO, 1)));
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

    @Test
    void ticketPurchaseHonoursTierQuotaAndCreatesTicketCode() {
        UserAccount user = users.save(new UserAccount("tickets@test.local", "unused", "Ticket Buyer", Role.USER));
        Event event = new Event("Ticketed event", "Test", "Theatre", LocalDateTime.now().plusDays(2), 3);
        event.addTicketType("Early bird", "Limited", new BigDecimal("150"), 1);
        event.addTicketType("General", "Standard", new BigDecimal("300"), 2);
        event = events.save(event);
        Long eventId = event.getId();
        Long earlyBirdId = event.getTicketTypes().getFirst().getId();

        var result = service.register(eventId, new PurchaseRequest(earlyBirdId, 1), principal(user));

        assertThat(result.quantity()).isEqualTo(1);
        assertThat(result.ticketTypeName()).isEqualTo("Early bird");
        assertThat(result.ticketCode()).startsWith("GTH-");
        assertThatThrownBy(() -> service.register(eventId, new PurchaseRequest(earlyBirdId, 1), principal(users.save(new UserAccount("second-ticket@test.local", "unused", "Second Buyer", Role.USER)))))
                .isInstanceOfSatisfying(ResponseStatusException.class, ex -> assertThat(ex.getReason()).isEqualTo("This ticket type is sold out"));
    }

    @Test
    void staffCheckInUsesTheTicketCodeOnlyOnce() {
        UserAccount user = users.save(new UserAccount("checkin@test.local", "unused", "Check In", Role.USER));
        Event event = new Event("Check-in event", "Test", "Gate", LocalDateTime.now().plusDays(2), 2);
        event.addTicketType("Door ticket", "Entry", BigDecimal.ZERO, 2);
        event = events.save(event);

        var ticket = service.register(event.getId(), new PurchaseRequest(event.getTicketTypes().getFirst().getId(), 1), principal(user));
        var first = service.checkIn(ticket.ticketCode());
        var second = service.checkIn(ticket.ticketCode());

        assertThat(first.checkedIn()).isTrue();
        assertThat(first.checkedInAt()).isNotNull();
        assertThat(second.checkedInAt()).isEqualTo(first.checkedInAt());
    }

    private Principal principal(UserAccount user) { return user::getEmail; }
}
