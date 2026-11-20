#!/bin/bash
# Initialise Firebase Authentication (e-mail / mot de passe) pour Fuzo.
P=fuzo-855ba
T=$(gcloud auth print-access-token)
H=(-H "Authorization: Bearer $T" -H "X-Goog-User-Project: $P" -H "Content-Type: application/json")
echo "== Initialisation Auth"
curl -s -X POST "https://identitytoolkit.googleapis.com/v2/projects/$P/identityPlatform:initializeAuth" "${H[@]}" -d '{}' | head -c 400; echo
sleep 3
echo "== Connexion e-mail + domaines"
curl -s -X PATCH "https://identitytoolkit.googleapis.com/admin/v2/projects/$P/config?updateMask=signIn.email,authorizedDomains" "${H[@]}" \
  -d '{"signIn":{"email":{"enabled":true,"passwordRequired":true}},"authorizedDomains":["localhost","fuzo-855ba.firebaseapp.com","fuzo-855ba.web.app","ayemanebdr.github.io"]}' \
  | python3 -c "import sys,json;c=json.load(sys.stdin);print('ERREUR',c['error']) if 'error' in c else print('OK email:',c.get('signIn',{}).get('email'),'domaines:',c.get('authorizedDomains'))"
