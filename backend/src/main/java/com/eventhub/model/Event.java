package com.eventhub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false, length = 2000)
    private String description;
    @Column(nullable = false)
    private String location;
    @Column(nullable = false)
    private LocalDateTime startsAt;
    @Column(nullable = false)
    private int capacity;

    protected Event() {}
    public Event(String title, String description, String location, LocalDateTime startsAt, int capacity) {
        update(title, description, location, startsAt, capacity);
    }
    public void update(String title, String description, String location, LocalDateTime startsAt, int capacity) {
        this.title = title; this.description = description; this.location = location;
        this.startsAt = startsAt; this.capacity = capacity;
    }
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getLocation() { return location; }
    public LocalDateTime getStartsAt() { return startsAt; }
    public int getCapacity() { return capacity; }
}

