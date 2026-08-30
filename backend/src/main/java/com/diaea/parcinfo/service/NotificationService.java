package com.diaea.parcinfo.service;

import com.diaea.parcinfo.model.Notification;
import com.diaea.parcinfo.model.Utilisateur;
import com.diaea.parcinfo.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public Notification envoyer(Utilisateur utilisateur, String type, String message) {
        Notification notification = Notification.builder()
                .utilisateur(utilisateur)
                .type(type)
                .message(message)
                .lue(false)
                .build();
        return notificationRepository.save(notification);
    }

    public List<Notification> getMesNotifications(Long utilisateurId) {
        return notificationRepository.findByUtilisateurIdOrderByDateEnvoiDesc(utilisateurId);
    }

    public List<Notification> getNotificationsNonLues(Long utilisateurId) {
        return notificationRepository.findByUtilisateurIdAndLueFalseOrderByDateEnvoiDesc(utilisateurId);
    }

    @Transactional
    public void marquerCommeLue(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setLue(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void toutMarquerCommeLu(Long utilisateurId) {
        List<Notification> nonLues = notificationRepository.findByUtilisateurIdAndLueFalseOrderByDateEnvoiDesc(utilisateurId);
        nonLues.forEach(n -> n.setLue(true));
        notificationRepository.saveAll(nonLues);
    }
}
