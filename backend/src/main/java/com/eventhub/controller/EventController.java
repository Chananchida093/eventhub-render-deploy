package com.eventhub.controller;

import com.eventhub.dto.ApiDtos.*;
import com.eventhub.service.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController @RequestMapping("/api")
public class EventController {
    private final EventService service;
    public EventController(EventService service) { this.service = service; }
    @GetMapping("/events") public List<EventDto> events(Principal p) { return service.list(p); }
    @GetMapping("/events/{id}") public EventDto event(@PathVariable Long id, Principal p) { return service.get(id, p); }
    @PostMapping("/events/{id}/registrations") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void register(@PathVariable Long id, Principal p) { service.register(id, p); }
    @DeleteMapping("/events/{id}/registrations") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancel(@PathVariable Long id, Principal p) { service.cancel(id, p); }
    @GetMapping("/registrations/me") public List<RegistrationDto> mine(Principal p) { return service.mine(p); }
}

