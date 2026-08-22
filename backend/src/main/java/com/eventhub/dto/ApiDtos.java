package com.eventhub.dto;

import com.eventhub.model.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

public final class ApiDtos {
    private ApiDtos() {}
    public record LoginRequest(@Email String email, @NotBlank String password) {}
    public record UserDto(Long id, String name, String email, Role role) {
        public static UserDto from(UserAccount user) { return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole()); }
    }
    public record TicketTypeRequest(Long id, @NotBlank @Size(max=80) String name,
                                    @Size(max=500) String description, @NotNull @DecimalMin("0.00") BigDecimal price,
                                    @Min(1) int capacity) {}
    public record PurchaseRequest(@NotNull Long ticketTypeId, @Min(1) @Max(10) int quantity) {}
    public record DetailImageRequest(@NotBlank @Size(max=2000) String url, @NotBlank @Size(max=24) String placement) {}
    public record DetailImageDto(String url, String placement) { public static DetailImageDto from(DetailImage image) { return new DetailImageDto(image.getUrl(), image.getPlacement()); } }
    public record EventRequest(@NotBlank String title, @NotBlank @Size(max=2000) String description,
                               @NotBlank String location, @NotNull LocalDateTime startsAt,
                               @Min(1) int capacity, @NotBlank String category, @Size(max=2000) String imageUrl, List<@Valid DetailImageRequest> detailImages,
                               @NotEmpty List<@Valid TicketTypeRequest> ticketTypes) {}
    public record TicketTypeDto(Long id, String name, String description, BigDecimal price, int capacity,
                                long sold, long remaining) {
        public static TicketTypeDto from(TicketTypeRow row) {
            return new TicketTypeDto(row.id(), row.name(), row.description(), row.price(), row.capacity(), row.sold(), Math.max(0, row.capacity() - row.sold()));
        }
    }
    public record EventDto(Long id, String title, String description, String location,
                           LocalDateTime startsAt, int capacity, String category, String imageUrl, List<DetailImageDto> detailImages, long registeredCount,
                           long spotsLeft, String status, boolean registered, List<TicketTypeDto> ticketTypes) {
        public static EventDto from(Event event, long count, boolean registered, List<TicketTypeDto> ticketTypes) {
            long spots = Math.max(0, event.getCapacity() - count);
            String status = !event.getStartsAt().isAfter(LocalDateTime.now()) ? "ENDED" : spots == 0 ? "FULL" : "OPEN";
            return new EventDto(event.getId(), event.getTitle(), event.getDescription(), event.getLocation(),
                    event.getStartsAt(), event.getCapacity(), event.getCategory(), event.getImageUrl(), event.getDetailImages().stream().map(DetailImageDto::from).toList(), count, spots, status, registered, ticketTypes);
        }
        public static EventDto from(EventListRow row, List<TicketTypeDto> ticketTypes) {
            long spots = Math.max(0, row.capacity() - row.registeredCount());
            String status = !row.startsAt().isAfter(LocalDateTime.now()) ? "ENDED" : spots == 0 ? "FULL" : "OPEN";
            return new EventDto(row.id(), row.title(), row.description(), row.location(), row.startsAt(),
                    row.capacity(), row.category() == null || row.category().isBlank() ? "COMMUNITY" : row.category(), row.imageUrl(), List.of(), row.registeredCount(), spots, status, row.registered(), ticketTypes);
        }
    }
    public record EventPageDto(List<EventDto> items, int page, int size, long totalElements,
                               int totalPages, boolean hasNext, boolean hasPrevious,
                               long totalOpenEvents, long totalRegistrations) {}
    public record RegistrationDto(Long id, LocalDateTime registeredAt, int quantity, String ticketCode,
                                  String ticketTypeName, BigDecimal totalPrice, EventDto event) {}
    public record AttendeeDto(Long id, String name, String email, LocalDateTime registeredAt,
                              String ticketType, int quantity, String ticketCode, LocalDateTime checkedInAt) {}
    public record CheckInRequest(@NotBlank @Size(max = 32) String ticketCode) {}
    public record CheckInDto(String ticketCode, String attendeeName, String eventTitle, String ticketType,
                             int quantity, boolean checkedIn, LocalDateTime checkedInAt) {}
    public record ErrorDto(String message) {}
}
