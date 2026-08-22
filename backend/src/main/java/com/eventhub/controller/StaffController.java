package com.eventhub.controller;

import com.eventhub.dto.ApiDtos.CheckInDto;
import com.eventhub.dto.ApiDtos.CheckInRequest;
import com.eventhub.service.EventService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
public class StaffController {
    private final EventService service;
    public StaffController(EventService service) { this.service = service; }

    @PostMapping("/check-in")
    public CheckInDto checkIn(@Valid @RequestBody CheckInRequest request) {
        return service.checkIn(request.ticketCode());
    }
}
