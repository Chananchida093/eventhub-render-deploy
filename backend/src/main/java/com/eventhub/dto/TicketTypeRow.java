package com.eventhub.dto;

import java.math.BigDecimal;

/** Aggregate ticket availability, fetched once for an event page. */
public record TicketTypeRow(Long id, Long eventId, String name, String description,
                            BigDecimal price, int capacity, long sold) {}
