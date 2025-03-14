#!/bin/bash

BASE_URL="http://localhost:3000/api"

echo "🔄 Création d'un profil..."
PROFILE_ID=$(curl -s -X POST -H "Content-Type: application/json" -d '{
  "name": "John Doe",
  "email": "john_doe@example.com"
}' $BASE_URL/profiles | jq -r '._id')

if [ "$PROFILE_ID" == "null" ]; then
  echo "❌ Erreur: Impossible de créer le profil."
  exit 1
fi
echo "✅ Profil créé avec ID: $PROFILE_ID"

echo "🔄 Création d'un autre profil pour tester les amis..."
FRIEND_ID=$(curl -s -X POST -H "Content-Type: application/json" -d '{
  "name": "Jane Doe",
  "email": "jane_doe@example.com"
}' $BASE_URL/profiles | jq -r '._id')

if [ "$FRIEND_ID" == "null" ]; then
  echo "❌ Erreur: Impossible de créer le profil ami."
  exit 1
fi
echo "✅ Profil ami créé avec ID: $FRIEND_ID"

echo "🔍 Récupération de tous les profils..."
curl -s $BASE_URL/profiles | jq

echo "🔍 Récupération du profil par ID..."
curl -s "$BASE_URL/profiles/$PROFILE_ID" | jq

echo "✏️ Mise à jour du profil..."
UPDATE_RESPONSE=$(curl -s -X PUT -H "Content-Type: application/json" -d '{
  "name": "John Updated",
  "email": "john_updated_'$RANDOM'@example.com"
}' "$BASE_URL/profiles/$PROFILE_ID")

if echo "$UPDATE_RESPONSE" | grep -q "E11000 duplicate key error"; then
  echo "❌ Erreur: L'email est déjà utilisé, modification ignorée."
else
  echo "✅ Profil mis à jour."
fi

echo "➕ Ajout d'une expérience..."
EXP_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{
  "title": "Développeur Web1",
  "company": "Tech Corp",
  "dates": {
    "start": "2022-01-01T00:00:00.000Z",
    "end": "2024-01-01T00:00:00.000Z"
  },
  "description": "Développement dapplications web"
}' "$BASE_URL/profiles/$PROFILE_ID/experience")

EXP_ID=$(echo "$EXP_RESPONSE" | jq -r '.experience[-1]._id')

if [ "$EXP_ID" == "null" ]; then
  echo "❌ Erreur: Impossible d'ajouter une expérience."
  exit 1
fi
echo "✅ Expérience ajoutée avec ID: $EXP_ID"

echo "➖ Suppression d'une expérience..."
curl -s -X DELETE "$BASE_URL/profiles/$PROFILE_ID/experience/$EXP_ID" | jq

echo "➕ Ajout d'une compétence..."
curl -s -X POST -H "Content-Type: application/json" -d '{
  "skill": "JavaScript"
}' "$BASE_URL/profiles/$PROFILE_ID/skills" | jq

echo "➖ Suppression d'une compétence..."
curl -s -X DELETE "$BASE_URL/profiles/$PROFILE_ID/skills/JavaScript" | jq

echo "📝 Mise à jour des informations..."
curl -s -X PUT -H "Content-Type: application/json" -d '{
  "bio": "Développeur expérimenté",
  "location": "Paris",
  "website": "https://example.com"
}' "$BASE_URL/profiles/$PROFILE_ID/information" | jq

echo "👥 Ajout d'un ami..."
curl -s -X POST -H "Content-Type: application/json" -d '{
  "friendId": "'"$FRIEND_ID"'"
}' "$BASE_URL/profiles/$PROFILE_ID/friends" | jq

echo "🔍 Récupération de la liste des amis..."
curl -s "$BASE_URL/profiles/$PROFILE_ID/friends" | jq

echo "🗑 Suppression (soft delete) du profil..."
curl -s -X DELETE "$BASE_URL/profiles/$PROFILE_ID" | jq

echo "✅ Tests terminés !"
