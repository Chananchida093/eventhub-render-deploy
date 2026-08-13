package com.eventhub.repository;

import com.eventhub.model.Event;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.Optional;
import com.eventhub.dto.EventListRow;

public interface EventRepository extends JpaRepository<Event, Long> {
    @Query(value = """
            select new com.eventhub.dto.EventListRow(
                e.id, e.title, e.description, e.location, e.startsAt, e.capacity,
                count(distinct r.id), case when count(distinct ur.id) > 0 then true else false end)
            from Event e
            left join Registration r on r.event.id = e.id
            left join Registration ur on ur.event.id = e.id
                and :userId is not null and ur.user.id = :userId
            where (:search = '' or lower(e.title) like lower(:search)
                or lower(e.description) like lower(:search)
                or lower(e.location) like lower(:search))
            group by e.id, e.title, e.description, e.location, e.startsAt, e.capacity
            having (:status = 'ALL'
                or (:status = 'OPEN' and e.startsAt > :now and count(distinct r.id) < e.capacity)
                or (:status = 'FULL' and e.startsAt > :now and count(distinct r.id) >= e.capacity)
                or (:status = 'ENDED' and e.startsAt <= :now)
                or (:status = 'REGISTERED' and :userId is not null and count(distinct ur.id) > 0))
            order by e.startsAt asc, e.id asc
            """,
            countQuery = """
            select count(e.id)
            from Event e
            where (:search = '' or lower(e.title) like lower(:search)
                or lower(e.description) like lower(:search)
                or lower(e.location) like lower(:search))
            and (
                :status = 'ALL'
                or (:status = 'OPEN' and e.startsAt > :now
                    and (select count(r1.id) from Registration r1 where r1.event.id = e.id) < e.capacity)
                or (:status = 'FULL' and e.startsAt > :now
                    and (select count(r2.id) from Registration r2 where r2.event.id = e.id) >= e.capacity)
                or (:status = 'ENDED' and e.startsAt <= :now)
                or (:status = 'REGISTERED' and :userId is not null
                    and exists (select ur1.id from Registration ur1 where ur1.event.id = e.id and ur1.user.id = :userId))
            )
            """)
    Page<EventListRow> search(@Param("userId") Long userId, @Param("search") String search,
                              @Param("status") String status, @Param("now") LocalDateTime now,
                              Pageable pageable);

    @Query("select count(e.id) from Event e where e.startsAt > :now and " +
            "(select count(r.id) from Registration r where r.event.id = e.id) < e.capacity")
    long countOpen(@Param("now") LocalDateTime now);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select e from Event e where e.id = :id")
    Optional<Event> findByIdForUpdate(@Param("id") Long id);
}
