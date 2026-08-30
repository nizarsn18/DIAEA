package com.diaea.parcinfo.service;

import com.diaea.parcinfo.model.*;
import com.diaea.parcinfo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReferentielService {

    private final DivisionRepository divisionRepository;
    private final ServiceRepository serviceRepository;
    private final ProfilRepository profilRepository;
    private final MarqueRepository marqueRepository;
    private final TypeMaterielRepository typeMaterielRepository;
    private final FournisseurRepository fournisseurRepository;

    // --- Divisions ---
    public List<Division> getAllDivisions() { return divisionRepository.findAll(); }
    public Division saveDivision(Division division) { return divisionRepository.save(division); }
    public void deleteDivision(Long id) { divisionRepository.deleteById(id); }

    // --- Services ---
    public List<com.diaea.parcinfo.model.Service> getAllServices() { return serviceRepository.findAll(); }
    public com.diaea.parcinfo.model.Service saveService(com.diaea.parcinfo.model.Service service) { return serviceRepository.save(service); }
    public void deleteService(Long id) { serviceRepository.deleteById(id); }

    // --- Profils ---
    public List<Profil> getAllProfils() { return profilRepository.findAll(); }
    public Profil saveProfil(Profil profil) { return profilRepository.save(profil); }

    // --- Marques ---
    public List<Marque> getAllMarques() { return marqueRepository.findAll(); }
    public Marque saveMarque(Marque marque) { return marqueRepository.save(marque); }
    public void deleteMarque(Long id) { marqueRepository.deleteById(id); }

    // --- Types Materiel ---
    public List<TypeMateriel> getAllTypesMateriel() { return typeMaterielRepository.findAll(); }
    public TypeMateriel saveTypeMateriel(TypeMateriel typeMateriel) { return typeMaterielRepository.save(typeMateriel); }
    public void deleteTypeMateriel(Long id) { typeMaterielRepository.deleteById(id); }

    // --- Fournisseurs ---
    public List<Fournisseur> getAllFournisseurs() { return fournisseurRepository.findAll(); }
    public Fournisseur saveFournisseur(Fournisseur fournisseur) { return fournisseurRepository.save(fournisseur); }
    public void deleteFournisseur(Long id) { fournisseurRepository.deleteById(id); }
}
