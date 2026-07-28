package com.diaea.parcinfo.controller;

import com.diaea.parcinfo.model.Referentiel;
import com.diaea.parcinfo.model.Role;
import com.diaea.parcinfo.model.Utilisateur;
import com.diaea.parcinfo.repository.ReferentielRepository;
import com.diaea.parcinfo.repository.RoleRepository;
import com.diaea.parcinfo.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMINISTRATEUR')")
public class AdminController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ReferentielRepository referentielRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<List<Utilisateur>> getAllUsers() {
        return ResponseEntity.ok(utilisateurRepository.findAll());
    }

    @PostMapping("/users")
    public ResponseEntity<Utilisateur> createUser(@RequestBody Utilisateur user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return ResponseEntity.ok(utilisateurRepository.save(user));
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleRepository.findAll());
    }

    @GetMapping("/referentiels")
    public ResponseEntity<List<Referentiel>> getReferentiels(@RequestParam(required = false) String categorie) {
        if (categorie != null) {
            return ResponseEntity.ok(referentielRepository.findByCategorie(categorie));
        }
        return ResponseEntity.ok(referentielRepository.findAll());
    }

    @PostMapping("/referentiels")
    public ResponseEntity<Referentiel> createReferentiel(@RequestBody Referentiel referentiel) {
        return ResponseEntity.ok(referentielRepository.save(referentiel));
    }
}
