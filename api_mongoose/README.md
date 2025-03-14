
# TD : API MongoDB avec Mongoose
---
# API de Gestion des Profils

Cette API permet de gérer des profils d'utilisateurs avec diverses fonctionnalités, comme la création, mise à jour, ajout d'expériences et de compétences, gestion des amis, et suppression des profils. Elle permet aussi d'effectuer des actions CRUD (Créer, Lire, Mettre à jour, Supprimer) sur les profils d'utilisateurs.

## Table des matières

1. [Installation](#installation)
2. [Environnement](#environnement)
3. [API Endpoints](#api-endpoints)
   - [Création de profil](#création-de-profil)
   - [Récupération de profils](#récupération-de-profils)
   - [Mise à jour de profil](#mise-à-jour-de-profil)
   - [Ajout d'expérience](#ajout-dexpérience)
   - [Ajout de compétence](#ajout-de-compétence)
   - [Ajout d'ami](#ajout-dami)
   - [Suppression de profil](#suppression-de-profil)
4. [Exemples de requêtes](#exemples-de-requêtes)
5. [Tests automatisés](#tests-automatisés)
6. [Technologies utilisées](#technologies-utilisées)

---

## Installation

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/votre-repository.git
   cd votre-repository
   ```

2. Installez les dépendances nécessaires :

   ```bash
   npm install
   ```

3. Démarrez le serveur local (par défaut sur le port 3000) :

   ```bash
   npm start
   ```

L'API sera disponible sur [http://localhost:3000/api](http://localhost:3000/api).

---

## Environnement

Cette API utilise `Node.js` et `MongoDB`. Assurez-vous que MongoDB est bien configuré et que votre base de données est opérationnelle avant de démarrer l'API.

---

## API Endpoints

### 1. Création de profil

**Endpoint** : `POST /api/profiles`  
**Description** : Crée un profil utilisateur avec un nom et un email.

**Requête** :

```json
{
  "name": "John Doe",
  "email": "john_doe@example.com"
}
```

**Réponse** :

```json
{
  "_id": "67d41d8c20922fbe31d61a97",
  "name": "John Doe",
  "email": "john_doe@example.com"
}
```

### 2. Récupération de profils

**Endpoint** : `GET /api/profiles?Location=Paris`  
**Description** : Récupère la liste de tous les profils.
**Filtres** : **search** (name, email, bio) // **skills** // **bio**

**Réponse** :

```json
[
  {
    "_id": "67d43fd195c82ee2b9c91ef0",
    "name": "John Updated",
    "email": "john_updated_21663@example.com",
    "skills": [],
    "information": {
      "_id": "67d43fd195c82ee2b9c91ef1",
      "bio": "Développeur expérimenté",
      "location": "Paris",
      "website": "https://example.com"
    },
    "friends": [
      "67d43fd195c82ee2b9c91ef4"
    ],
    "isDeleted": false,
    "experience": [],
    "createdAt": "2025-03-14T14:40:17.915Z",
    "updatedAt": "2025-03-14T14:40:18.036Z"
  }
]
```

**Endpoint** : `GET /api/profiles/{id}`  
**Description** : Récupère un profil spécifique par son ID.

**Réponse** :

```json
{
  "_id": "67d41d8c20922fbe31d61a97",
  "name": "John Doe",
  "email": "john_doe@example.com"
}
```

### 3. Mise à jour de profil

**Endpoint** : `PUT /api/profiles/{id}`  
**Description** : Met à jour les informations d'un profil. Le champ `email` doit être unique.

**Requête** :

```json
{
  "name": "John Updated",
  "email": "john_updated@example.com"
}
```

**Réponse** :

```json
{
  "_id": "67d41d8c20922fbe31d61a97",
  "name": "John Updated",
  "email": "john_updated@example.com"
}
```

### 4. Ajout d'expérience

**Endpoint** : `POST /api/profiles/{id}/experience`  
**Description** : Ajoute une expérience professionnelle à un profil.

**Requête** :

```json
{
  "title": "Développeur Web",
  "company": "Tech Corp",
  "dates": {
    "start": "2022-01-01T00:00:00.000Z",
    "end": "2024-01-01T00:00:00.000Z"
  },
  "description": "Développement d'applications web"
}
```

**Réponse** :

```json
{
  "_id": "67d41d8c20922fbe31d61aa1",
  "title": "Développeur Web",
  "company": "Tech Corp"
}
```

### 5. Ajout de compétence

**Endpoint** : `POST /api/profiles/{id}/skills`  
**Description** : Ajoute une compétence à un profil.

**Requête** :

```json
{
  "skill": "JavaScript"
}
```

**Réponse** :

```json
{
  "skills": ["JavaScript"]
}
```

### 6. Ajout d'ami

**Endpoint** : `POST /api/profiles/{id}/friends`  
**Description** : Ajoute un ami au profil.

**Requête** :

```json
{
  "friendId": "67d41d8c20922fbe31d61a9b"
}
```

**Réponse** :

```json
{
  "_id": "67d41d8c20922fbe31d61a97",
  "friends": [
    {
      "_id": "67d41d8c20922fbe31d61a9b",
      "name": "Jane Doe",
      "email": "jane_doe@example.com"
    }
  ]
}
```

### 7. Suppression de profil

**Endpoint** : `DELETE /api/profiles/{id}`  
**Description** : Supprime (soft delete) un profil.

**Réponse** :

```json
{
  "message": "Profil supprimé avec succès"
}
```

---

## Exemples de requêtes

Voici des exemples de commandes `curl` pour tester les différents endpoints :

1. **Créer un profil :**
   
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john_doe@example.com"}' http://localhost:3000/api/profiles
   ```

2. **Récupérer tous les profils :**
   
   ```bash
   curl http://localhost:3000/api/profiles
   ```

3. **Ajouter une expérience à un profil :**
   
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"title": "Développeur Web", "company": "Tech Corp", "dates": {"start": "2022-01-01", "end": "2024-01-01"}, "description": "Développement d'applications web"}' http://localhost:3000/api/profiles/67d41d8c20922fbe31d61a97/experience
   ```

4. **Supprimer un profil :**
   
   ```bash
   curl -X DELETE http://localhost:3000/api/profiles/67d41d8c20922fbe31d61a97
   ```

---

## Tests automatisés

Un script bash est fourni pour tester les fonctionnalités principales de l'API. Il effectue les actions suivantes :
- Création de profils
- Mise à jour de profils
- Ajout, suppression d'expériences et de compétences
- Ajout d'amis et suppression de profils.

Exécutez le script avec la commande suivante :

```bash
./test_api.sh
```

---

## Technologies utilisées

- **Node.js** : Environnement d'exécution JavaScript
- **Express.js** : Framework de serveur web pour Node.js
- **MongoDB** : Base de données NoSQL
- **jq** : Outil pour manipuler les JSON en ligne de commande
- **Curl** : Outil pour envoyer des requêtes HTTP

---
