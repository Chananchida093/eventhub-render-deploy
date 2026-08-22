package com.eventhub.controller;
import com.eventhub.model.PageView;
import com.eventhub.repository.PageViewRepository;
import com.eventhub.repository.RegistrationRepository;
import com.eventhub.repository.EventRepository;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api")
public class AnalyticsController {
    private final PageViewRepository views; private final EventRepository events; private final RegistrationRepository registrations;
    public AnalyticsController(PageViewRepository views, EventRepository events, RegistrationRepository registrations) { this.views = views; this.events = events; this.registrations = registrations; }
    @PostMapping("/analytics/visit") public void visit(@RequestBody Map<String, String> payload) { String type = "EVENT".equals(payload.get("type")) ? "EVENT" : "SITE"; Long eventId = payload.get("eventId") == null ? null : Long.valueOf(payload.get("eventId")); String session = payload.getOrDefault("sessionId", "anonymous"); views.save(new PageView(type, eventId, session)); }
    @GetMapping("/admin/analytics") public Map<String, Long> summary() { return Map.of("siteViews", views.countByType("SITE"), "uniqueVisitors", views.uniqueSessions("SITE"), "eventViews", views.countByType("EVENT"), "events", events.count(), "registrations", registrations.count()); }
}
