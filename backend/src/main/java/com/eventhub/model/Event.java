package com.eventhub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.*;

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
    @Column(length = 40)
    private String category = "COMMUNITY";
    @Column(length = 2000)
    private String imageUrl;
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id asc")
    private final List<TicketType> ticketTypes = new ArrayList<>();

    protected Event() {}
    public Event(String title, String description, String location, LocalDateTime startsAt, int capacity) {
        update(title, description, location, startsAt, capacity);
    }
    public Event(String title, String description, String location, LocalDateTime startsAt, int capacity, String category) {
        update(title, description, location, startsAt, capacity, category);
    }
    public void update(String title, String description, String location, LocalDateTime startsAt, int capacity) {
        this.title = title; this.description = description; this.location = location;
        this.startsAt = startsAt; this.capacity = capacity;
    }
    public void update(String title, String description, String location, LocalDateTime startsAt, int capacity, String category) {
        update(title, description, location, startsAt, capacity); this.category = category;
    }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl == null || imageUrl.isBlank() ? null : imageUrl.trim(); }
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getLocation() { return location; }
    public LocalDateTime getStartsAt() { return startsAt; }
    public int getCapacity() { return capacity; }
    public String getCategory() { return category == null || category.isBlank() ? "COMMUNITY" : category; }
    public String getImageUrl() { return imageUrl; }
    public void setCategory(String category) { this.category = category; }
    public List<TicketType> getTicketTypes() { return ticketTypes; }
    public void addTicketType(String name, String description, BigDecimal price, int capacity) {
        ticketTypes.add(new TicketType(this, name, description, price, capacity));
    }
}
