package com.eventhub.dto;

import java.time.LocalDateTime;

/** One database projection row for the paginated event list. */
public record EventListRow(Long id, String title, String description, String location,
                           LocalDateTime startsAt, int capacity, String category, String imageUrl, long registeredCount,
                           boolean registered) {}
