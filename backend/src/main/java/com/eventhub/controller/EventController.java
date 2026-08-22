package com.eventhub.controller;

import com.eventhub.dto.ApiDtos.*;
import com.eventhub.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController @RequestMapping("/api")
public class EventController {
    private final EventService service;
    public EventController(EventService service) { this.service = service; }
    @GetMapping("/events")
    public EventPageDto events(Principal p,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "20") int size,
                               @RequestParam(defaultValue = "") String search,
                               @RequestParam(defaultValue = "ALL") String category,
                               @RequestParam(defaultValue = "ALL") String status) {
        return service.list(p, page, size, search, category, status);
    }
    @GetMapping("/events/{id}") public EventDto event(@PathVariable Long id, Principal p) { return service.get(id, p); }
    @PostMapping("/events/{id}/registrations")
    public RegistrationDto register(@PathVariable Long id, @Valid @RequestBody PurchaseRequest request, Principal p) { return service.register(id, request, p); }
    @DeleteMapping("/events/{id}/registrations") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancel(@PathVariable Long id, Principal p) { service.cancel(id, p); }
    @GetMapping("/registrations/me") public List<RegistrationDto> mine(Principal p) { return service.mine(p); }
}
