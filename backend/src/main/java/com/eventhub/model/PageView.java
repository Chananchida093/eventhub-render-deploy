package com.eventhub.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "page_views")
public class PageView {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 20) private String type;
    private Long eventId;
    @Column(nullable = false, length = 80) private String sessionId;
    @Column(nullable = false) private LocalDateTime viewedAt = LocalDateTime.now();
    protected PageView() {}
    public PageView(String type, Long eventId, String sessionId) { this.type = type; this.eventId = eventId; this.sessionId = sessionId; }
}
