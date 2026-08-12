package com.eventhub.controller;

import com.eventhub.dto.ApiDtos.ErrorDto;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorDto> status(ResponseStatusException ex) {
        return ResponseEntity.status(ex.getStatusCode()).body(new ErrorDto(ex.getReason() == null ? "Request failed" : ex.getReason()));
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDto> validation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream().findFirst()
                .map(e -> e.getField() + " " + e.getDefaultMessage()).orElse("Invalid request");
        return ResponseEntity.badRequest().body(new ErrorDto(message));
    }
}

