package com.eventhub.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ticket_types")
public class TicketType {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "event_id")
    private Event event;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false, length = 500)
    private String description = "";
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;
    @Column(nullable = false)
    private int capacity;

    protected TicketType() {}
    public TicketType(Event event, String name, String description, BigDecimal price, int capacity) {
        this.event = event; update(name, description, price, capacity);
    }
    public void update(String name, String description, BigDecimal price, int capacity) {
        this.name = name; this.description = description == null ? "" : description; this.price = price; this.capacity = capacity;
    }
    public Long getId() { return id; }
    public Event getEvent() { return event; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public int getCapacity() { return capacity; }
}
