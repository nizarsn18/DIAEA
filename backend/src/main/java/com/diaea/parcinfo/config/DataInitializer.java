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
    private DivisionRepository divisionRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ProfilRepository profilRepository;

    @Autowired
    private MarqueRepository marqueRepository;

    @Autowired
    private TypeMaterielRepository typeMaterielRepository;

    @Autowired
    private FournisseurRepository fournisseurRepository;

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

        // 2. Initialiser les Référentiels Diagramme (Divisions & Services)
        Division div1 = divisionRepository.findByLibelle("Division Aménagement Hydro-Agricole")
                .orElseGet(() -> divisionRepository.save(Division.builder().libelle("Division Aménagement Hydro-Agricole").build()));

        Division div2 = divisionRepository.findByLibelle("Division des Systèmes d'Information (DSI)")
                .orElseGet(() -> divisionRepository.save(Division.builder().libelle("Division des Systèmes d'Information (DSI)").build()));

        Service srv1 = serviceRepository.findByLibelle("Service Irrigation")
                .orElseGet(() -> serviceRepository.save(Service.builder().libelle("Service Irrigation").division(div1).build()));

        Service srv2 = serviceRepository.findByLibelle("Cellule Informatique")
                .orElseGet(() -> serviceRepository.save(Service.builder().libelle("Cellule Informatique").division(div2).build()));

        // Marques & Types
        Marque mDell = marqueRepository.findByLibelle("Dell").orElseGet(() -> marqueRepository.save(Marque.builder().libelle("Dell").build()));
        Marque mHP = marqueRepository.findByLibelle("HP").orElseGet(() -> marqueRepository.save(Marque.builder().libelle("HP").build()));
        Marque mLenovo = marqueRepository.findByLibelle("Lenovo").orElseGet(() -> marqueRepository.save(Marque.builder().libelle("Lenovo").build()));

        TypeMateriel tPc = typeMaterielRepository.findByLibelle("PC Portable").orElseGet(() -> typeMaterielRepository.save(TypeMateriel.builder().libelle("PC Portable").build()));
        TypeMateriel tImp = typeMaterielRepository.findByLibelle("Imprimante").orElseGet(() -> typeMaterielRepository.save(TypeMateriel.builder().libelle("Imprimante").build()));
        TypeMateriel tEcran = typeMaterielRepository.findByLibelle("Écran LCD").orElseGet(() -> typeMaterielRepository.save(TypeMateriel.builder().libelle("Écran LCD").build()));

        // Fournisseurs
        Fournisseur f1 = fournisseurRepository.findByNom("Maroc Bureau IT").orElseGet(() -> fournisseurRepository.save(Fournisseur.builder()
                .nom("Maroc Bureau IT")
                .adresse("Avenue Hassan II, Rabat")
                .contact("M. Alami")
                .telephone("0537000000")
                .build()));

        // Profils
        profilRepository.findByLibelle("Administrateur").orElseGet(() -> profilRepository.save(Profil.builder().libelle("Administrateur").description("Gestion globale").build()));
        profilRepository.findByLibelle("Cadre User").orElseGet(() -> profilRepository.save(Profil.builder().libelle("Cadre User").description("Utilisateur standard").build()));

        // 3. Initialiser les Utilisateurs de test
        Role adminRole = roleRepository.findByName(RoleName.ADMINISTRATEUR).orElseThrow();
        Role celluleRole = roleRepository.findByName(RoleName.CELLULE_INFORMATIQUE).orElseThrow();
        Role csRole = roleRepository.findByName(RoleName.CHEF_SERVICE).orElseThrow();
        Role cdRole = roleRepository.findByName(RoleName.CHEF_DIVISION).orElseThrow();
        Role userRole = roleRepository.findByName(RoleName.UTILISATEUR).orElseThrow();

        if (!utilisateurRepository.existsByUsername("admin")) {
            Utilisateur admin = Utilisateur.builder()
                    .matricule("ADM-001")
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .nom("Administrateur")
                    .prenom("Système")
                    .email("admin@diaea.gov.ma")
                    .fonction("Administrateur IT")
                    .division(div2.getLibelle())
                    .service(srv2.getLibelle())
                    .serviceRef(srv2)
                    .niveauAcces("COMPLET")
                    .roles(new HashSet<>(Arrays.asList(adminRole, celluleRole)))
                    .actif(true)
                    .build();
            utilisateurRepository.save(admin);
        }

        if (!utilisateurRepository.existsByUsername("chef_service")) {
            Utilisateur cs = Utilisateur.builder()
                    .matricule("CS-002")
                    .username("chef_service")
                    .password(passwordEncoder.encode("password"))
                    .nom("EL Amrani")
                    .prenom("Karim")
                    .email("k.elamrani@diaea.gov.ma")
                    .fonction("Chef de Service Irrigation")
                    .division(div1.getLibelle())
                    .service(srv1.getLibelle())
                    .serviceRef(srv1)
                    .dateNominationService(LocalDate.of(2023, 1, 15))
                    .roles(new HashSet<>(Arrays.asList(csRole)))
                    .actif(true)
                    .build();
            utilisateurRepository.save(cs);
        }

        if (!utilisateurRepository.existsByUsername("chef_division")) {
            Utilisateur cd = Utilisateur.builder()
                    .matricule("CD-003")
                    .username("chef_division")
                    .password(passwordEncoder.encode("password"))
                    .nom("BENNANI")
                    .prenom("Hassan")
                    .email("h.bennani@diaea.gov.ma")
                    .fonction("Chef de Division")
                    .division(div1.getLibelle())
                    .service("Direction Division")
                    .dateNominationDivision(LocalDate.of(2022, 6, 1))
                    .roles(new HashSet<>(Arrays.asList(cdRole)))
                    .actif(true)
                    .build();
            utilisateurRepository.save(cd);
        }

        Utilisateur demandeur = null;
        if (!utilisateurRepository.existsByUsername("cadre1")) {
            demandeur = Utilisateur.builder()
                    .matricule("CAD-004")
                    .username("cadre1")
                    .password(passwordEncoder.encode("password"))
                    .nom("CHRAIBI")
                    .prenom("Omar")
                    .email("o.chraibi@diaea.gov.ma")
                    .fonction("Ingénieur Agronome")
                    .division(div1.getLibelle())
                    .service(srv1.getLibelle())
                    .serviceRef(srv1)
                    .roles(new HashSet<>(Arrays.asList(userRole)))
                    .actif(true)
                    .build();
            utilisateurRepository.save(demandeur);
        } else {
            demandeur = utilisateurRepository.findByUsername("cadre1").orElse(null);
        }

        // 4. Initialiser du Matériel démonstratif
        if (materielRepository.findAll().isEmpty() && demandeur != null) {
            Materiel mat1 = Materiel.builder()
                    .codeInventaire("DIAEA-2026-PC-0001")
                    .typeMateriel("PC Portable")
                    .typeMaterielRef(tPc)
                    .marque("Dell")
                    .marqueRef(mDell)
                    .modele("Latitude 5440")
                    .numeroSerie("SN-DELL-883921")
                    .caracteristiquesTechniques("Intel i7 13th Gen, 16GB RAM, 512GB SSD NVMe")
                    .sourceAcquisition(SourceAcquisition.BDC)
                    .referenceAcquisition("BDC-2025-012")
                    .dateAcquisition(LocalDate.of(2025, 4, 15))
                    .dateFinGarantie(LocalDate.of(2028, 4, 15))
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
                    .typeMaterielRef(tImp)
                    .marque("HP")
                    .marqueRef(mHP)
                    .modele("LaserJet Pro MFP M428fdw")
                    .numeroSerie("SN-HP-992310")
                    .caracteristiquesTechniques("Multifonction Laser N&B, Réseau, Recto-Verso")
                    .sourceAcquisition(SourceAcquisition.DSI)
                    .referenceAcquisition("DSI-DEM-2025-44")
                    .dateAcquisition(LocalDate.of(2025, 6, 10))
                    .dateFinGarantie(LocalDate.of(2027, 6, 10))
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
