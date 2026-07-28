package com.diaea.parcinfo.config;

import com.diaea.parcinfo.model.*;
import com.diaea.parcinfo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private MaterielRepository materielRepository;

    @Autowired
    private DemandeMaterielRepository demandeRepository;

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private ReferentielRepository referentielRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Initialiser les Rôles
        for (RoleName name : RoleName.values()) {
            if (roleRepository.findByName(name).isEmpty()) {
                roleRepository.save(Role.builder()
                        .name(name)
                        .description("Rôle système: " + name.name())
                        .build());
            }
        }

        // 2. Initialiser les Utilisateurs de test
        Role adminRole = roleRepository.findByName(RoleName.ADMINISTRATEUR).orElseThrow();
        Role celluleRole = roleRepository.findByName(RoleName.CELLULE_INFORMATIQUE).orElseThrow();
        Role csRole = roleRepository.findByName(RoleName.CHEF_SERVICE).orElseThrow();
        Role cdRole = roleRepository.findByName(RoleName.CHEF_DIVISION).orElseThrow();
        Role userRole = roleRepository.findByName(RoleName.UTILISATEUR).orElseThrow();

        if (!utilisateurRepository.existsByUsername("admin")) {
            Utilisateur admin = Utilisateur.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .nom("Administrateur")
                    .prenom("Système")
                    .email("admin@diaea.gov.ma")
                    .fonction("Administrateur IT")
                    .division("DSI / Cellule IT")
                    .service("Administration")
                    .roles(new HashSet<>(Arrays.asList(adminRole, celluleRole)))
                    .actif(true)
                    .build();
            utilisateurRepository.save(admin);
        }

        if (!utilisateurRepository.existsByUsername("chef_service")) {
            Utilisateur cs = Utilisateur.builder()
                    .username("chef_service")
                    .password(passwordEncoder.encode("password"))
                    .nom("EL AMrani")
                    .prenom("Karim")
                    .email("k.elamrani@diaea.gov.ma")
                    .fonction("Chef de Service Irrigation")
                    .division("Aménagement Hydro-Agricole")
                    .service("Service Irrigation")
                    .roles(new HashSet<>(Arrays.asList(csRole)))
                    .actif(true)
                    .build();
            utilisateurRepository.save(cs);
        }

        if (!utilisateurRepository.existsByUsername("chef_division")) {
            Utilisateur cd = Utilisateur.builder()
                    .username("chef_division")
                    .password(passwordEncoder.encode("password"))
                    .nom("BENNANI")
                    .prenom("Hassan")
                    .email("h.bennani@diaea.gov.ma")
                    .fonction("Chef de Division")
                    .division("Aménagement Hydro-Agricole")
                    .service("Direction Division")
                    .roles(new HashSet<>(Arrays.asList(cdRole)))
                    .actif(true)
                    .build();
            utilisateurRepository.save(cd);
        }

        Utilisateur demandeur = null;
        if (!utilisateurRepository.existsByUsername("cadre1")) {
            demandeur = Utilisateur.builder()
                    .username("cadre1")
                    .password(passwordEncoder.encode("password"))
                    .nom("CHRAIBI")
                    .prenom("Omar")
                    .email("o.chraibi@diaea.gov.ma")
                    .fonction("Ingénieur Agronome")
                    .division("Aménagement Hydro-Agricole")
                    .service("Service Irrigation")
                    .roles(new HashSet<>(Arrays.asList(userRole)))
                    .actif(true)
                    .build();
            utilisateurRepository.save(demandeur);
        } else {
            demandeur = utilisateurRepository.findByUsername("cadre1").orElse(null);
        }

        // 3. Initialiser des Référentiels
        if (referentielRepository.findAll().isEmpty()) {
            referentielRepository.save(Referentiel.builder().categorie("TYPE_MATERIEL").code("PC_PORTABLE").libelle("PC Portable").build());
            referentielRepository.save(Referentiel.builder().categorie("TYPE_MATERIEL").code("PC_BUREAU").libelle("Ordinateur de bureau").build());
            referentielRepository.save(Referentiel.builder().categorie("TYPE_MATERIEL").code("IMPRIMANTE").libelle("Imprimante").build());
            referentielRepository.save(Referentiel.builder().categorie("MARQUE").code("DELL").libelle("Dell Technologies").build());
            referentielRepository.save(Referentiel.builder().categorie("MARQUE").code("HP").libelle("HP Inc.").build());
            referentielRepository.save(Referentiel.builder().categorie("MARQUE").code("LENOVO").libelle("Lenovo Group").build());
        }

        // 4. Initialiser du Matériel démonstratif
        if (materielRepository.findAll().isEmpty() && demandeur != null) {
            Materiel mat1 = Materiel.builder()
                    .codeInventaire("DIAEA-2026-PC-0001")
                    .typeMateriel("PC Portable")
                    .marque("Dell")
                    .modele("Latitude 5440")
                    .numeroSerie("SN-DELL-883921")
                    .caracteristiquesTechniques("Intel i7 13th Gen, 16GB RAM, 512GB SSD NVMe")
                    .sourceAcquisition(SourceAcquisition.BDC)
                    .referenceAcquisition("BDC-2025-012")
                    .dateAcquisition(LocalDate.of(2025, 4, 15))
                    .garantie("3 Ans (Fin 2028)")
                    .etatMateriel(EtatMateriel.AFFECTE)
                    .localisation("Bureau 102 - Service Irrigation")
                    .utilisateurAffectataire(demandeur)
                    .dateAffectation(LocalDate.of(2025, 5, 1))
                    .observations("Matériel attribué en bon état avec sacoche et chargeur")
                    .build();
            materielRepository.save(mat1);

            Materiel mat2 = Materiel.builder()
                    .codeInventaire("DIAEA-2026-IMP-0002")
                    .typeMateriel("Imprimante")
                    .marque("HP")
                    .modele("LaserJet Pro MFP M428fdw")
                    .numeroSerie("SN-HP-992310")
                    .caracteristiquesTechniques("Multifonction Laser N&B, Réseau, Recto-Verso")
                    .sourceAcquisition(SourceAcquisition.DSI)
                    .referenceAcquisition("DSI-DEM-2025-44")
                    .dateAcquisition(LocalDate.of(2025, 6, 10))
                    .garantie("2 Ans")
                    .etatMateriel(EtatMateriel.DISPONIBLE)
                    .localisation("Stock Cellule Informatique")
                    .observations("En stock disponible pour affectation rapide")
                    .build();
            materielRepository.save(mat2);
        }

        // 5. Initialiser une demande et un incident démonstratifs
        if (demandeRepository.findAll().isEmpty() && demandeur != null) {
            DemandeMateriel dem = DemandeMateriel.builder()
                    .numeroDemande("DEM-2026-0001")
                    .demandeur(demandeur)
                    .typeMaterielDemande("Vidéoprojecteur")
                    .quantiteDemande(1)
                    .justificationBesoin("Nécessaire pour la présentation des réunions de suivi du projet d'irrigation à la division.")
                    .urgence(UrgenceDemande.URGENTE)
                    .statut(StatutDemande.EN_ATTENTE_VALIDATION_CS)
                    .build();
            demandeRepository.save(dem);
        }

        if (incidentRepository.findAll().isEmpty() && demandeur != null) {
            Incident inc = Incident.builder()
                    .numeroTicket("TICK-2026-001")
                    .declarant(demandeur)
                    .typeIncident(TypeIncident.PROBLEME_RESEAU)
                    .descriptionProbleme("Perte intermittente d'accès au réseau LAN et au serveur partagé de la division.")
                    .priorite(PrioriteIncident.NORMALE)
                    .statut(StatutIncident.NOUVEAU)
                    .build();
            incidentRepository.save(inc);
        }
    }
}
