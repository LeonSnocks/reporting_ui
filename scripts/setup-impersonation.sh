#!/bin/bash

# Setup-Script für Service Account Impersonation
# Dieses Script hilft beim Einrichten der notwendigen IAM-Berechtigungen

set -e

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Projekt-ID
PROJECT_ID="snocks-analytics"

echo -e "${GREEN}Service Account Impersonation Setup${NC}"
echo "=========================================="
echo ""

# Schritt 1: Service Account E-Mail abfragen
echo -e "${YELLOW}Schritt 1: Service Account E-Mail${NC}"
read -p "Gib die E-Mail-Adresse des Service Accounts ein: " SERVICE_ACCOUNT_EMAIL

if [ -z "$SERVICE_ACCOUNT_EMAIL" ]; then
    echo -e "${RED}Fehler: Service Account E-Mail ist erforderlich${NC}"
    exit 1
fi

echo "Service Account: $SERVICE_ACCOUNT_EMAIL"
echo ""

# Schritt 2: Benutzer E-Mail abfragen
echo -e "${YELLOW}Schritt 2: Benutzer E-Mail${NC}"
read -p "Gib deine Google Cloud E-Mail-Adresse ein: " USER_EMAIL

if [ -z "$USER_EMAIL" ]; then
    echo -e "${RED}Fehler: Benutzer E-Mail ist erforderlich${NC}"
    exit 1
fi

echo "Benutzer: $USER_EMAIL"
echo ""

# Schritt 3: Überprüfen ob Service Account existiert
echo -e "${YELLOW}Schritt 3: Überprüfe Service Account${NC}"
if gcloud iam service-accounts describe "$SERVICE_ACCOUNT_EMAIL" --project="$PROJECT_ID" &>/dev/null; then
    echo -e "${GREEN}✓ Service Account gefunden${NC}"
else
    echo -e "${RED}✗ Service Account nicht gefunden${NC}"
    echo "Bitte erstelle den Service Account zuerst in der Google Cloud Console"
    exit 1
fi
echo ""

# Schritt 4: Service Account Token Creator Rolle zuweisen
echo -e "${YELLOW}Schritt 4: Weise Service Account Token Creator Rolle zu${NC}"
echo "Dies gewährt $USER_EMAIL die Berechtigung, $SERVICE_ACCOUNT_EMAIL zu impersonieren"
read -p "Fortfahren? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    gcloud iam service-accounts add-iam-policy-binding "$SERVICE_ACCOUNT_EMAIL" \
        --project="$PROJECT_ID" \
        --role="roles/iam.serviceAccountTokenCreator" \
        --member="user:$USER_EMAIL"
    
    echo -e "${GREEN}✓ Rolle erfolgreich zugewiesen${NC}"
else
    echo -e "${YELLOW}Übersprungen${NC}"
fi
echo ""

# Schritt 5: Überprüfen ob BigQuery Berechtigungen vorhanden sind
echo -e "${YELLOW}Schritt 5: Überprüfe BigQuery Berechtigungen${NC}"
BQ_VIEWER=$(gcloud projects get-iam-policy "$PROJECT_ID" \
    --flatten="bindings[].members" \
    --filter="bindings.members:serviceAccount:$SERVICE_ACCOUNT_EMAIL AND bindings.role:roles/bigquery.dataViewer" \
    --format="value(bindings.role)" 2>/dev/null | head -n 1)

BQ_JOB_USER=$(gcloud projects get-iam-policy "$PROJECT_ID" \
    --flatten="bindings[].members" \
    --filter="bindings.members:serviceAccount:$SERVICE_ACCOUNT_EMAIL AND bindings.role:roles/bigquery.jobUser" \
    --format="value(bindings.role)" 2>/dev/null | head -n 1)

if [ -n "$BQ_VIEWER" ] && [ -n "$BQ_JOB_USER" ]; then
    echo -e "${GREEN}✓ BigQuery Berechtigungen vorhanden${NC}"
else
    echo -e "${YELLOW}⚠ BigQuery Berechtigungen fehlen${NC}"
    echo "Der Service Account benötigt folgende Rollen:"
    echo "  - roles/bigquery.dataViewer"
    echo "  - roles/bigquery.jobUser"
    echo ""
    echo "Weise sie zu mit:"
    echo "  gcloud projects add-iam-policy-binding $PROJECT_ID \\"
    echo "    --member=\"serviceAccount:$SERVICE_ACCOUNT_EMAIL\" \\"
    echo "    --role=\"roles/bigquery.dataViewer\""
    echo ""
    echo "  gcloud projects add-iam-policy-binding $PROJECT_ID \\"
    echo "    --member=\"serviceAccount:$SERVICE_ACCOUNT_EMAIL\" \\"
    echo "    --role=\"roles/bigquery.jobUser\""
fi
echo ""

# Schritt 6: Application Default Credentials einrichten
echo -e "${YELLOW}Schritt 6: Richte Application Default Credentials ein${NC}"
echo "Dies wird ein Browserfenster öffnen, um dich anzumelden"
read -p "Fortfahren? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    gcloud auth application-default login --impersonate-service-account="$SERVICE_ACCOUNT_EMAIL"
    echo -e "${GREEN}✓ ADC erfolgreich eingerichtet${NC}"
else
    echo -e "${YELLOW}Übersprungen${NC}"
    echo "Führe manuell aus:"
    echo "  gcloud auth application-default login --impersonate-service-account=$SERVICE_ACCOUNT_EMAIL"
fi
echo ""

# Schritt 7: Test
echo -e "${YELLOW}Schritt 7: Test${NC}"
echo "Teste die Authentifizierung..."
if gcloud auth application-default print-access-token &>/dev/null; then
    echo -e "${GREEN}✓ Authentifizierung erfolgreich${NC}"
else
    echo -e "${RED}✗ Authentifizierung fehlgeschlagen${NC}"
    echo "Überprüfe die Konfiguration und versuche es erneut"
    exit 1
fi
echo ""

# Zusammenfassung
echo -e "${GREEN}Setup abgeschlossen!${NC}"
echo "=========================================="
echo ""
echo "Service Account: $SERVICE_ACCOUNT_EMAIL"
echo "Benutzer: $USER_EMAIL"
echo "Projekt: $PROJECT_ID"
echo ""
echo "Du kannst jetzt die Anwendung starten:"
echo "  npm run dev"
echo ""
echo "Die Anwendung verwendet automatisch die eingerichteten Credentials."

