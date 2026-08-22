package com.eventhub.repository;

import com.eventhub.dto.TicketTypeRow;
import com.eventhub.model.TicketType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;

public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {
    boolean existsByEventId(Long eventId);
    List<TicketType> findByEventIdOrderByIdAsc(Long eventId);
    @Query("""
        select new com.eventhub.dto.TicketTypeRow(t.id, t.event.id, t.name, t.description, t.price, t.capacity,
            coalesce(sum(r.quantity), 0))
        from TicketType t left join Registration r on r.ticketType.id = t.id
        where t.event.id in :eventIds
        group by t.id, t.event.id, t.name, t.description, t.price, t.capacity
        order by t.event.id asc, t.id asc
        """)
    List<TicketTypeRow> summariesForEventIds(@Param("eventIds") Collection<Long> eventIds);
}
