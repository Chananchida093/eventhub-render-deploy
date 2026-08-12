package com.eventhub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registrations", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "event_id"}))
public class Registration {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "user_id")
    private UserAccount user;
    @ManyToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "event_id")
    private Event event;
    @Column(nullable = false)
    private LocalDateTime registeredAt;

    protected Registration() {}
    public Registration(UserAccount user, Event event) {
        this.user = user; this.event = event; this.registeredAt = LocalDateTime.now();
    }
    public Long getId() { return id; }
    public UserAccount getUser() { return user; }
    public Event getEvent() { return event; }
    public LocalDateTime getRegisteredAt() { return registeredAt; }
}

