#!/bin/bash
# Configure Firebase pour Fuzo : connexion e-mail, domaines autorisés, appli Web.
P=fuzo-855ba
T=$(gcloud auth print-access-token)
H=(-H "Authorization: Bearer $T" -H "X-Goog-User-Project: $P" -H "Content-Type: application/json")
echo "== Connexion e-mail + domaines"
curl -s -X PATCH "https://identitytoolkit.googleapis.com/admin/v2/projects/$P/config?updateMask=signIn.email,authorizedDomains" "${H[@]}" \
  -d '{"signIn":{"email":{"enabled":true,"passwordRequired":true}},"authorizedDomains":["localhost","fuzo-855ba.firebaseapp.com","fuzo-855ba.web.app","ayemanebdr.github.io"]}' | head -c 500; echo
appid() { curl -s "https://firebase.googleapis.com/v1beta1/projects/$P/webApps" "${H[@]}" | python3 -c "import sys,json;a=json.load(sys.stdin).get('apps',[]);print(a[0]['appId'] if a else '')"; }
echo "== Appli Web"
ID=$(appid)
if [ -z "$ID" ]; then
  curl -s -X POST "https://firebase.googleapis.com/v1beta1/projects/$P/webApps" "${H[@]}" -d '{"displayName":"fuzo"}' | head -c 300; echo
  for i in $(seq 1 30); do sleep 3; ID=$(appid); [ -n "$ID" ] && break; done
fi
echo "== Configuration a copier"
curl -s "https://firebase.googleapis.com/v1beta1/projects/$P/webApps/$ID/config" "${H[@]}" | python3 -c "import sys,json;c=json.load(sys.stdin);[print(k.ljust(18),c[k]) for k in c]"
