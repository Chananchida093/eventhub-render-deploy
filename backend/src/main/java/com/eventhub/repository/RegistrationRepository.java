package com.eventhub.repository;

import com.eventhub.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    long countByEventId(Long eventId);
    @Query("select coalesce(sum(r.quantity), 0) from Registration r where r.event.id = :eventId")
    long seatsReservedByEventId(@Param("eventId") Long eventId);
    @Query("select coalesce(sum(r.quantity), 0) from Registration r where r.ticketType.id = :ticketTypeId")
    long seatsReservedByTicketTypeId(@Param("ticketTypeId") Long ticketTypeId);
    boolean existsByUserIdAndEventId(Long userId, Long eventId);
    List<Registration> findByUserIdOrderByEventStartsAtAsc(Long userId);
    List<Registration> findByEventIdOrderByRegisteredAtAsc(Long eventId);
    List<Registration> findTop8ByEventIdAndCheckedInAtIsNotNullOrderByCheckedInAtDesc(Long eventId);
    Optional<Registration> findByTicketCode(String ticketCode);
    void deleteByUserIdAndEventId(Long userId, Long eventId);
    void deleteByEventId(Long eventId);
}
