package com.eventhub.dto;

import com.eventhub.model.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

public final class ApiDtos {
    private ApiDtos() {}
    public record LoginRequest(@Email String email, @NotBlank String password) {}
    public record UserDto(Long id, String name, String email, Role role) {
        public static UserDto from(UserAccount user) { return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole()); }
    }
    public record EventRequest(@NotBlank String title, @NotBlank @Size(max=2000) String description,
                               @NotBlank String location, @NotNull LocalDateTime startsAt,
                               @Min(1) int capacity) {}
    public record EventDto(Long id, String title, String description, String location,
                           LocalDateTime startsAt, int capacity, long registeredCount,
                           long spotsLeft, String status, boolean registered) {
        public static EventDto from(Event event, long count, boolean registered) {
            long spots = Math.max(0, event.getCapacity() - count);
            String status = !event.getStartsAt().isAfter(LocalDateTime.now()) ? "ENDED" : spots == 0 ? "FULL" : "OPEN";
            return new EventDto(event.getId(), event.getTitle(), event.getDescription(), event.getLocation(),
                    event.getStartsAt(), event.getCapacity(), count, spots, status, registered);
        }
        public static EventDto from(EventListRow row) {
            long spots = Math.max(0, row.capacity() - row.registeredCount());
            String status = !row.startsAt().isAfter(LocalDateTime.now()) ? "ENDED" : spots == 0 ? "FULL" : "OPEN";
            return new EventDto(row.id(), row.title(), row.description(), row.location(), row.startsAt(),
                    row.capacity(), row.registeredCount(), spots, status, row.registered());
        }
    }
    public record EventPageDto(List<EventDto> items, int page, int size, long totalElements,
                               int totalPages, boolean hasNext, boolean hasPrevious,
                               long totalOpenEvents, long totalRegistrations) {}
    public record RegistrationDto(Long id, LocalDateTime registeredAt, EventDto event) {}
    public record AttendeeDto(Long id, String name, String email, LocalDateTime registeredAt) {}
    public record ErrorDto(String message) {}
}
