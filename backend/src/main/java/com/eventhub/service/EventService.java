package com.eventhub.service;

import com.eventhub.dto.ApiDtos.*;
import com.eventhub.dto.EventListRow;
import com.eventhub.dto.TicketTypeRow;
import com.eventhub.model.*;
import com.eventhub.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.security.Principal;
import java.util.*;
import java.math.BigDecimal;

@Service
public class EventService {
    private final EventRepository events;
    private final RegistrationRepository registrations;
    private final UserRepository users;
    private final TicketTypeRepository ticketTypes;
    public EventService(EventRepository events, RegistrationRepository registrations, UserRepository users, TicketTypeRepository ticketTypes) {
        this.events = events; this.registrations = registrations; this.users = users; this.ticketTypes = ticketTypes;
    }

    @Transactional(readOnly = true)
    public EventPageDto list(Principal principal, int page, int size, String search, String category, String status) {
        UserAccount viewer = principal == null ? null : currentUser(principal);
        Long userId = viewer == null ? null : viewer.getId();
        int safePage = Math.max(0, page);
        int safeSize = Math.min(Math.max(1, size), 100);
        String safeSearch = search == null || search.isBlank() ? "" : "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
        String safeStatus = normalizeStatus(status); String safeCategory = normalizeCategory(category);
        Pageable pageable = PageRequest.of(safePage, safeSize);
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        Page<EventListRow> result = events.search(userId, safeSearch, safeCategory, safeStatus, now, pageable);
        boolean admin = viewer != null && viewer.getRole() == Role.ADMIN;
        Map<Long, List<TicketTypeDto>> typesByEvent = ticketTypesFor(result.getContent().stream().map(EventListRow::id).toList());
        return new EventPageDto(result.getContent().stream().map(row -> EventDto.from(row, typesByEvent.getOrDefault(row.id(), List.of()))).toList(), result.getNumber(),
                result.getSize(), result.getTotalElements(), result.getTotalPages(), result.hasNext(), result.hasPrevious(),
                admin ? events.countOpen(now) : 0, admin ? registrations.count() : 0);
    }

    @Transactional(readOnly = true)
    public EventDto get(Long id, Principal principal) {
        Event event = events.findById(id).orElseThrow(() -> notFound("Event not found"));
        Long userId = principal == null ? null : currentUser(principal).getId();
        return dto(event, userId);
    }

    @Transactional
    public RegistrationDto register(Long eventId, PurchaseRequest request, Principal principal) {
        UserAccount user = currentUser(principal);
        Event event = events.findByIdForUpdate(eventId).orElseThrow(() -> notFound("Event not found"));
        if (!event.getStartsAt().isAfter(java.time.LocalDateTime.now())) throw conflict("Registration has closed");
        if (registrations.existsByUserIdAndEventId(user.getId(), eventId)) throw conflict("You are already registered");
        TicketType ticketType = ticketTypes.findById(request.ticketTypeId()).orElseThrow(() -> notFound("Ticket type not found"));
        if (!ticketType.getEvent().getId().equals(eventId)) throw conflict("Ticket type does not belong to this event");
        long reserved = registrations.seatsReservedByEventId(eventId);
        if (reserved + request.quantity() > event.getCapacity()) throw conflict("This event is full");
        if (registrations.seatsReservedByTicketTypeId(ticketType.getId()) + request.quantity() > ticketType.getCapacity()) throw conflict("This ticket type is sold out");
        Registration registration = registrations.save(new Registration(user, event, ticketType, request.quantity()));
        return registrationDto(registration, user.getId());
    }

    /** Backwards-compatible helper for service tests and old clients. */
    @Transactional
    public void register(Long eventId, Principal principal) {
        Event event = events.findById(eventId).orElseThrow(() -> notFound("Event not found"));
        TicketType defaultTicket = event.getTicketTypes().stream().findFirst().orElse(null);
        if (defaultTicket == null) {
            UserAccount user = currentUser(principal);
            if (!event.getStartsAt().isAfter(java.time.LocalDateTime.now())) throw conflict("Registration has closed");
            if (registrations.existsByUserIdAndEventId(user.getId(), eventId)) throw conflict("You are already registered");
            if (registrations.seatsReservedByEventId(eventId) >= event.getCapacity()) throw conflict("This event is full");
            registrations.save(new Registration(user, event));
        } else register(eventId, new PurchaseRequest(defaultTicket.getId(), 1), principal);
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
                .map(r -> registrationDto(r, user.getId())).toList();
    }

    @Transactional
    public EventDto create(EventRequest request) {
        validateTicketPlan(request);
        Event event = new Event(request.title(), request.description(), request.location(), request.startsAt(), request.capacity(), normalizeCategory(request.category()));
        event.setImageUrl(request.imageUrl());
        event.setDetailImageUrl(request.detailImageUrl());
        request.ticketTypes().forEach(type -> event.addTicketType(type.name(), type.description(), type.price(), type.capacity()));
        return dto(events.save(event), null);
    }

    @Transactional
    public EventDto update(Long id, EventRequest request) {
        Event event = events.findByIdForUpdate(id).orElseThrow(() -> notFound("Event not found"));
        long count = registrations.seatsReservedByEventId(id);
        if (request.capacity() < count) throw conflict("Capacity cannot be lower than current registrations");
        validateTicketPlan(request);
        event.update(request.title(), request.description(), request.location(), request.startsAt(), request.capacity(), normalizeCategory(request.category()));
        event.setImageUrl(request.imageUrl());
        event.setDetailImageUrl(request.detailImageUrl());
        Map<Long, TicketType> oldById = event.getTicketTypes().stream().collect(java.util.stream.Collectors.toMap(TicketType::getId, item -> item));
        Set<Long> requestedIds = request.ticketTypes().stream().map(TicketTypeRequest::id).filter(Objects::nonNull).collect(java.util.stream.Collectors.toSet());
        for (TicketType old : new ArrayList<>(event.getTicketTypes())) {
            long sold = registrations.seatsReservedByTicketTypeId(old.getId());
            if (!requestedIds.contains(old.getId()) && sold > 0) throw conflict("A ticket type with sales cannot be removed");
            if (!requestedIds.contains(old.getId())) event.getTicketTypes().remove(old);
        }
        for (TicketTypeRequest type : request.ticketTypes()) {
            if (type.id() != null && oldById.containsKey(type.id())) {
                TicketType old = oldById.get(type.id());
                if (type.capacity() < registrations.seatsReservedByTicketTypeId(old.getId())) throw conflict("Ticket capacity cannot be lower than tickets sold");
                old.update(type.name(), type.description(), type.price(), type.capacity());
            } else event.addTicketType(type.name(), type.description(), type.price(), type.capacity());
        }
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
                .map(this::attendeeDto).toList();
    }

    @Transactional
    public CheckInDto checkIn(String rawTicketCode) {
        return checkIn(null, rawTicketCode);
    }

    @Transactional
    public CheckInDto checkIn(Long eventId, String rawTicketCode) {
        String ticketCode = rawTicketCode == null ? "" : rawTicketCode.trim().toUpperCase(Locale.ROOT);
        Registration registration = registrations.findByTicketCode(ticketCode).orElseThrow(() -> notFound("Ticket not found"));
        if (eventId != null && !registration.getEvent().getId().equals(eventId)) throw conflict("This ticket belongs to another event");
        registration.checkIn();
        TicketType ticket = registration.getTicketType();
        return new CheckInDto(registration.getTicketCode(), registration.getUser().getName(), registration.getEvent().getTitle(),
                ticket == null ? "General admission" : ticket.getName(), registration.getQuantity(), registration.isCheckedIn(), registration.getCheckedInAt());
    }

    @Transactional(readOnly = true)
    public List<AttendeeDto> recentCheckIns(Long eventId) {
        return registrations.findTop8ByEventIdAndCheckedInAtIsNotNullOrderByCheckedInAtDesc(eventId).stream().map(this::attendeeDto).toList();
    }

    private AttendeeDto attendeeDto(Registration r) {
        return new AttendeeDto(r.getUser().getId(), r.getUser().getName(), r.getUser().getEmail(), r.getRegisteredAt(),
                r.getTicketType() == null ? "General admission" : r.getTicketType().getName(), r.getQuantity(), r.getTicketCode(), r.getCheckedInAt());
    }

    private EventDto dto(Event event, Long userId) {
        return EventDto.from(event, registrations.seatsReservedByEventId(event.getId()),
                userId != null && registrations.existsByUserIdAndEventId(userId, event.getId()),
                ticketTypesFor(List.of(event.getId())).getOrDefault(event.getId(), List.of()));
    }
    private Map<Long, List<TicketTypeDto>> ticketTypesFor(Collection<Long> ids) {
        if (ids.isEmpty()) return Map.of();
        Map<Long, List<TicketTypeDto>> result = new HashMap<>();
        for (TicketTypeRow row : ticketTypes.summariesForEventIds(ids)) result.computeIfAbsent(row.eventId(), ignored -> new ArrayList<>()).add(TicketTypeDto.from(row));
        return result;
    }
    private RegistrationDto registrationDto(Registration registration, Long userId) {
        TicketType ticket = registration.getTicketType();
        BigDecimal total = ticket == null ? BigDecimal.ZERO : ticket.getPrice().multiply(BigDecimal.valueOf(registration.getQuantity()));
        return new RegistrationDto(registration.getId(), registration.getRegisteredAt(), registration.getQuantity(), registration.getTicketCode(),
                ticket == null ? "General admission" : ticket.getName(), total, dto(registration.getEvent(), userId));
    }
    private void validateTicketPlan(EventRequest request) {
        int total = request.ticketTypes().stream().mapToInt(TicketTypeRequest::capacity).sum();
        if (total != request.capacity()) throw conflict("Ticket quantities must add up to maximum attendees");
    }
    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) return "ALL";
        String normalized = status.trim().toUpperCase(Locale.ROOT);
        return Set.of("ALL", "OPEN", "FULL", "ENDED", "REGISTERED").contains(normalized) ? normalized : "ALL";
    }
    private String normalizeCategory(String category) {
        if (category == null || category.isBlank()) return "ALL";
        String normalized = category.trim().toUpperCase(Locale.ROOT);
        return Set.of("ALL", "TECH", "DESIGN", "CAREER", "COMMUNITY").contains(normalized) ? normalized : "ALL";
    }
    public UserAccount currentUser(Principal principal) {
        if (principal == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required");
        return users.findByEmail(principal.getName()).orElseThrow(() -> notFound("User not found"));
    }
    private ResponseStatusException notFound(String message) { return new ResponseStatusException(HttpStatus.NOT_FOUND, message); }
    private ResponseStatusException conflict(String message) { return new ResponseStatusException(HttpStatus.CONFLICT, message); }
}
