package com.eventhub.controller;

import com.eventhub.dto.ApiDtos.CheckInDto;
import com.eventhub.dto.ApiDtos.CheckInRequest;
import com.eventhub.service.EventService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.eventhub.dto.ApiDtos.AttendeeDto;

@RestController
@RequestMapping("/api/staff")
public class StaffController {
    private final EventService service;
    public StaffController(EventService service) { this.service = service; }

    @PostMapping("/events/{eventId}/check-in")
    public CheckInDto checkIn(@PathVariable Long eventId, @Valid @RequestBody CheckInRequest request) {
        return service.checkIn(eventId, request.ticketCode());
    }

    @GetMapping("/events/{eventId}/attendees") public List<AttendeeDto> attendees(@PathVariable Long eventId) { return service.attendees(eventId); }
    @GetMapping("/events/{eventId}/recent-check-ins") public List<AttendeeDto> recentCheckIns(@PathVariable Long eventId) { return service.recentCheckIns(eventId); }
}
