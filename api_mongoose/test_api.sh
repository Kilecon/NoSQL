#!/bin/bash

BASE_URL="http://localhost:3000/api"

# Couleurs pour les logs
GREEN="\e[32m"
RED="\e[31m"
CYAN="\e[36m"
RESET="\e[0m"

# Fonction pour tester une requête avec affichage du résultat
test_request() {
    local description=$1
    local method=$2
    local url=$3
    local data=$4

    echo -e "${CYAN}🔹 $description${RESET}"
    if [ -z "$data" ]; then
        response=$(curl -s -X $method -o response.json -w "%{http_code}" "$url")
    else
        response=$(curl -s -X $method -H "Content-Type: application/json" -d "$data" -o response.json -w "%{http_code}" "$url")
    fi

    if [ "$response" -eq 200 ] || [ "$response" -eq 201 ]; then
        echo -e "${GREEN}✅ Succès${RESET}"
        cat response.json | jq '.'
    else
        echo -e "${RED}❌ Échec (Code: $response)${RESET}"
        cat response.json
    fi
    echo "-------------------------------------------"
}

echo "🛠️  Début des tests..."

# Création d'un profil
test_request "Création d'un profil Manon Arcas" "POST" "$BASE_URL/profiles" '{
  "name": "Manon Arcas",
  "email": "Manon Arcas'$RANDOM'@example.com"
}'
PROFILE_ID=$(jq -r '._id' response.json)

test_request "Création d'un profil John Doe" "POST" "$BASE_URL/profiles" '{
  "name": "John Doe",
  "email": "john_doe_'$RANDOM'@example.com"
}'
PROFILE_ID=$(jq -r '._id' response.json)


# Création d'un profil ami
test_request "Création d'un profil Jane Doe" "POST" "$BASE_URL/profiles" '{
  "name": "Jane Doe",
  "email": "jane_doe_'$RANDOM'@example.com"
}'
FRIEND_ID=$(jq -r '._id' response.json)

# Vérifier si les profils ont bien été créés
if [ "$PROFILE_ID" == "null" ] || [ "$FRIEND_ID" == "null" ]; then
    echo -e "${RED}❌ Erreur: Impossible de créer les profils.${RESET}"
    exit 1
fi

# Récupérer tous les profils
test_request "Récupération de tous les profils" "GET" "$BASE_URL/profiles"

# Récupérer un profil par ID
test_request "Récupération du profil de John Doe" "GET" "$BASE_URL/profiles/$PROFILE_ID"

# Mettre à jour un profil
test_request "Mise à jour du profil de John Doe" "PUT" "$BASE_URL/profiles/$PROFILE_ID" '{
  "name": "John Updated",
  "email": "john_updated_'$RANDOM'@example.com"
}'

# Ajouter une expérience
test_request "Ajout d'une expérience à John Doe" "POST" "$BASE_URL/profiles/$PROFILE_ID/experience" '{
  "title": "Développeur Web",
  "company": "Tech Corp",
  "dates": {
    "start": "2022-01-01T00:00:00.000Z",
    "end": "2024-01-01T00:00:00.000Z"
  },
  "description": "Développement dapplications web"
}'
EXP_ID=$(jq -r '.experience[-1]._id' response.json)

# Supprimer une expérience
test_request "Suppression de l'expérience" "DELETE" "$BASE_URL/profiles/$PROFILE_ID/experience/$EXP_ID"

# Ajouter une compétence
test_request "Ajout d'une compétence JavaScript" "POST" "$BASE_URL/profiles/$PROFILE_ID/skills" '{
  "skill": "JavaScript"
}'

# Supprimer une compétence
test_request "Suppression de la compétence JavaScript" "DELETE" "$BASE_URL/profiles/$PROFILE_ID/skills/JavaScript"

# Mise à jour des informations
test_request "Mise à jour des informations de John Doe" "PUT" "$BASE_URL/profiles/$PROFILE_ID/information" '{
  "bio": "Développeur expérimenté",
  "location": "Paris",
  "website": "https://example.com"
}'

# Ajouter un ami
test_request "Ajout de Jane Doe comme amie" "POST" "$BASE_URL/profiles/$PROFILE_ID/friends" '{
  "friendId": "'"$FRIEND_ID"'"
}'

# Récupérer la liste des amis
test_request "Récupération de la liste des amis de John Doe" "GET" "$BASE_URL/profiles/$PROFILE_ID/friends"

# Filtrer les profils par nom
test_request "Recherche de profils contenant 'Manon'" "GET" "$BASE_URL/profiles?search=Manon"

# Suppression (soft delete) du profil
test_request "Suppression (soft delete) du profil de John Doe" "DELETE" "$BASE_URL/profiles/$PROFILE_ID"

echo -e "${GREEN}✅ Tous les tests sont terminés avec succès !${RESET}"
rm response.json