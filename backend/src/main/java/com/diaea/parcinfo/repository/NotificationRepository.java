package com.diaea.parcinfo.repository;

import com.diaea.parcinfo.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUtilisateurIdOrderByDateEnvoiDesc(Long utilisateurId);
    List<Notification> findByUtilisateurIdAndLueFalseOrderByDateEnvoiDesc(Long utilisateurId);
    long countByUtilisateurIdAndLueFalse(Long utilisateurId);
}
