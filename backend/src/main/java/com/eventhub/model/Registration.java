package com.eventhub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "registrations", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "event_id"}))
public class Registration {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "user_id")
    private UserAccount user;
    @ManyToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "event_id")
    private Event event;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "ticket_type_id")
    private TicketType ticketType;
    private Integer quantity = 1;
    @Column(length = 32)
    private String ticketCode;
    @Column(nullable = false)
    private LocalDateTime registeredAt;
    private LocalDateTime checkedInAt;

    protected Registration() {}
    public Registration(UserAccount user, Event event) {
        this(user, event, null, 1);
    }
    public Registration(UserAccount user, Event event, TicketType ticketType, int quantity) {
        this.user = user; this.event = event; this.ticketType = ticketType; this.quantity = quantity;
        this.ticketCode = "GTH-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
        this.registeredAt = LocalDateTime.now();
    }
    public Long getId() { return id; }
    public UserAccount getUser() { return user; }
    public Event getEvent() { return event; }
    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public TicketType getTicketType() { return ticketType; }
    public int getQuantity() { return quantity == null ? 1 : quantity; }
    public String getTicketCode() { return ticketCode; }
    public LocalDateTime getCheckedInAt() { return checkedInAt; }
    public boolean isCheckedIn() { return checkedInAt != null; }
    public void checkIn() { if (checkedInAt == null) checkedInAt = LocalDateTime.now(); }
}
