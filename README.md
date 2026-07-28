# Application de Gestion du Parc Informatique de la DIAEA

Système complet de gestion centralisée et traçable du parc informatique pour la **Direction de l'Irrigation et de l'Aménagement de l'Espace Agricole (DIAEA)**.

## 🚀 Technologies Utilisées

- **Backend** : Java 17, Spring Boot 3.2, Spring Security, JWT, Spring Data JPA, Hibernate, Lombok
- **Frontend** : React 18, Vite, React Router v6, Axios, Lucide Icons, Custom Design System CSS
- **Base de données** : MySQL 8.0
- **DevOps & Containerisation** : Docker, Docker Compose, Git

---

## 🛠️ Structure du Projet

```text
stage/
├── backend/               # Application Backend Spring Boot (API REST)
│   ├── src/main/java/     # Package principal com.diaea.parcinfo
│   └── pom.xml            # Dépendances Maven
├── frontend/              # Application Frontend React (Interface Utilisateur)
│   ├── src/               # Composants, Pages, Context, API client
│   └── package.json       # Dépendances NPM
├── docker-compose.yml     # Configuration multi-containers Docker
└── README.md
```

---

## 💻 Instructions de Lancement

### Options 1 : Démarrage avec Docker Compose (Recommandé)

1. Assurez-vous que Docker est démarré.
2. À la racine du projet, lancez :
   ```bash
   docker-compose up --build -d
   ```
3. L'application Frontend sera accessible sur [http://localhost](http://localhost) et l'API Backend sur [http://localhost:8080/api](http://localhost:8080/api).

### Option 2 : Lancement en Mode Développement Local

#### 1. Base de données MySQL
Créez une base de données MySQL nommée `diaea_parc_db` :
```sql
CREATE DATABASE diaea_parc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 2. Backend Spring Boot
Dans le répertoire `backend/` :
```bash
# Compilation et lancement (sur Windows avec wrapper)
.\mvnw spring-boot:run
```
L'API sera disponible sur `http://localhost:8080/api`.

#### 3. Frontend React
Dans le répertoire `frontend/` :
```bash
npm install
npm run dev
```
L'application web sera accessible sur `http://localhost:5173`.

---

## 👥 Rôles et Droits d'Accès

- **Demandeur (`UTILISATEUR`)** : Création de demandes de matériel, signalement d'incidents, suivi de ses équipements.
- **Chef de Service (`CHEF_SERVICE`)** : Validation / Rejet 1er niveau des demandes de son service.
- **Chef de Division (`CHEF_DIVISION`)** : Validation / Rejet 2ème niveau et priorisation des demandes de sa division.
- **Cellule Informatique (`CELLULE_INFORMATIQUE`)** : Traitement des demandes (Stock/DSI/Acquisitions), gestion du parc et des incidents.
- **Administrateur (`ADMINISTRATEUR`)** : Gestion des utilisateurs, rôles, droits et référentiels paramétrables.
- **Consultation (`CONSULTATION`)** : Consultation en lecture seule des tableaux de bord et rapports.
