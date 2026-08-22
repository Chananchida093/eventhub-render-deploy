package com.eventhub.repository;
import com.eventhub.model.PageView;
import org.springframework.data.jpa.repository.*;
public interface PageViewRepository extends JpaRepository<PageView, Long> {
    long countByType(String type);
    long countByTypeAndEventId(String type, Long eventId);
    @Query("select count(distinct p.sessionId) from PageView p where p.type = :type") long uniqueSessions(@org.springframework.data.repository.query.Param("type") String type);
}
