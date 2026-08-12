package com.eventhub.repository;

import com.eventhub.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    long countByEventId(Long eventId);
    boolean existsByUserIdAndEventId(Long userId, Long eventId);
    List<Registration> findByUserIdOrderByEventStartsAtAsc(Long userId);
    List<Registration> findByEventIdOrderByRegisteredAtAsc(Long eventId);
    void deleteByUserIdAndEventId(Long userId, Long eventId);
    void deleteByEventId(Long eventId);
}

