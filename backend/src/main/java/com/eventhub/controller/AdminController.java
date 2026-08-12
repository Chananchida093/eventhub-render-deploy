package com.eventhub.controller;

import com.eventhub.dto.ApiDtos.*;
import com.eventhub.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/admin/events")
public class AdminController {
    private final EventService service;
    public AdminController(EventService service) { this.service = service; }
    @PostMapping public EventDto create(@Valid @RequestBody EventRequest request) { return service.create(request); }
    @PutMapping("/{id}") public EventDto update(@PathVariable Long id, @Valid @RequestBody EventRequest request) { return service.update(id, request); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { service.delete(id); }
    @GetMapping("/{id}/attendees") public List<AttendeeDto> attendees(@PathVariable Long id) { return service.attendees(id); }
}

