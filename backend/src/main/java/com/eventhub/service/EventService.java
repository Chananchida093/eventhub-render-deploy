package com.eventhub.service;

import com.eventhub.dto.ApiDtos.*;
import com.eventhub.model.*;
import com.eventhub.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.security.Principal;
import java.util.*;

@Service
public class EventService {
    private final EventRepository events;
    private final RegistrationRepository registrations;
    private final UserRepository users;
    public EventService(EventRepository events, RegistrationRepository registrations, UserRepository users) {
        this.events = events; this.registrations = registrations; this.users = users;
    }

    @Transactional(readOnly = true)
    public List<EventDto> list(Principal principal) {
        Long userId = principal == null ? null : currentUser(principal).getId();
        return events.findAll().stream().sorted(Comparator.comparing(Event::getStartsAt))
                .map(e -> dto(e, userId)).toList();
    }

    @Transactional(readOnly = true)
    public EventDto get(Long id, Principal principal) {
        Event event = events.findById(id).orElseThrow(() -> notFound("Event not found"));
        Long userId = principal == null ? null : currentUser(principal).getId();
        return dto(event, userId);
    }

    @Transactional
    public void register(Long eventId, Principal principal) {
        UserAccount user = currentUser(principal);
        Event event = events.findByIdForUpdate(eventId).orElseThrow(() -> notFound("Event not found"));
        if (!event.getStartsAt().isAfter(java.time.LocalDateTime.now())) throw conflict("Registration has closed");
        if (registrations.existsByUserIdAndEventId(user.getId(), eventId)) throw conflict("You are already registered");
        if (registrations.countByEventId(eventId) >= event.getCapacity()) throw conflict("This event is full");
        registrations.save(new Registration(user, event));
    }

    @Transactional
    public void cancel(Long eventId, Principal principal) {
        UserAccount user = currentUser(principal);
        if (!registrations.existsByUserIdAndEventId(user.getId(), eventId)) throw notFound("Registration not found");
        registrations.deleteByUserIdAndEventId(user.getId(), eventId);
    }

    @Transactional(readOnly = true)
    public List<RegistrationDto> mine(Principal principal) {
        UserAccount user = currentUser(principal);
        return registrations.findByUserIdOrderByEventStartsAtAsc(user.getId()).stream()
                .map(r -> new RegistrationDto(r.getId(), r.getRegisteredAt(), dto(r.getEvent(), user.getId()))).toList();
    }

    @Transactional
    public EventDto create(EventRequest request) {
        Event event = events.save(new Event(request.title(), request.description(), request.location(), request.startsAt(), request.capacity()));
        return dto(event, null);
    }

    @Transactional
    public EventDto update(Long id, EventRequest request) {
        Event event = events.findByIdForUpdate(id).orElseThrow(() -> notFound("Event not found"));
        long count = registrations.countByEventId(id);
        if (request.capacity() < count) throw conflict("Capacity cannot be lower than current registrations");
        event.update(request.title(), request.description(), request.location(), request.startsAt(), request.capacity());
        return dto(event, null);
    }

    @Transactional
    public void delete(Long id) {
        if (!events.existsById(id)) throw notFound("Event not found");
        registrations.deleteByEventId(id);
        events.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<AttendeeDto> attendees(Long eventId) {
        if (!events.existsById(eventId)) throw notFound("Event not found");
        return registrations.findByEventIdOrderByRegisteredAtAsc(eventId).stream()
                .map(r -> new AttendeeDto(r.getUser().getId(), r.getUser().getName(), r.getUser().getEmail(), r.getRegisteredAt())).toList();
    }

    private EventDto dto(Event event, Long userId) {
        return EventDto.from(event, registrations.countByEventId(event.getId()),
                userId != null && registrations.existsByUserIdAndEventId(userId, event.getId()));
    }
    public UserAccount currentUser(Principal principal) {
        if (principal == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
        return users.findByEmail(principal.getName()).orElseThrow(() -> notFound("User not found"));
    }
    private ResponseStatusException notFound(String message) { return new ResponseStatusException(HttpStatus.NOT_FOUND, message); }
    private ResponseStatusException conflict(String message) { return new ResponseStatusException(HttpStatus.CONFLICT, message); }
}

