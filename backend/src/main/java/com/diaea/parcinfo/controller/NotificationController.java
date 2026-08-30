package com.diaea.parcinfo.controller;

import com.diaea.parcinfo.model.Notification;
import com.diaea.parcinfo.model.Utilisateur;
import com.diaea.parcinfo.repository.UtilisateurRepository;
import com.diaea.parcinfo.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UtilisateurRepository utilisateurRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getMesNotifications(Authentication authentication) {
        Utilisateur user = utilisateurRepository.findByUsername(authentication.getName()).orElseThrow();
        return ResponseEntity.ok(notificationService.getMesNotifications(user.getId()));
    }

    @PutMapping("/{id}/lire")
    public ResponseEntity<Void> marquerCommeLue(@PathVariable Long id) {
        notificationService.marquerCommeLue(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/tout-lire")
    public ResponseEntity<Void> toutMarquerCommeLu(Authentication authentication) {
        Utilisateur user = utilisateurRepository.findByUsername(authentication.getName()).orElseThrow();
        notificationService.toutMarquerCommeLu(user.getId());
        return ResponseEntity.ok().build();
    }
}
