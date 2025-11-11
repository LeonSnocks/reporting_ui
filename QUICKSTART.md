# Quick Start Guide

Schnelleinstieg für die Einrichtung der Anwendung mit Service Account Impersonation.

## Voraussetzungen

- Node.js 18+ installiert
- Google Cloud SDK (`gcloud`) installiert
- Zugriff auf das Projekt `snocks-analytics`

## Schnellstart (5 Minuten)

### 1. Dependencies installieren

```bash
npm install
```

### 2. Service Account Impersonation einrichten

**Option A: Automatisches Setup-Script (Empfohlen)**

```bash
./scripts/setup-impersonation.sh
```

Das Script führt dich durch alle notwendigen Schritte.

**Option B: Manuelle Einrichtung**

```bash
# 1. Service Account E-Mail und deine E-Mail setzen
SERVICE_ACCOUNT_EMAIL="dein-service-account@snocks-analytics.iam.gserviceaccount.com"
USER_EMAIL="deine-email@domain.com"

# 2. Service Account Token Creator Rolle zuweisen
gcloud iam service-accounts add-iam-policy-binding $SERVICE_ACCOUNT_EMAIL \
  --project=snocks-analytics \
  --role="roles/iam.serviceAccountTokenCreator" \
  --member="user:$USER_EMAIL"

# 3. Application Default Credentials einrichten
gcloud auth application-default login --impersonate-service-account=$SERVICE_ACCOUNT_EMAIL
```

### 3. Anwendung starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## Überprüfen

### Credentials testen

```bash
# Sollte ein Access Token ausgeben
gcloud auth application-default print-access-token
```

### BigQuery Zugriff testen

```bash
# Sollte eine Liste von Datasets ausgeben
gcloud bq datasets list --project=snocks-analytics
```

## Häufige Probleme

### "Permission denied"

- Überprüfe, ob du die `Service Account Token Creator` Rolle hast
- Überprüfe, ob das Service Account BigQuery Berechtigungen hat

### "Could not load the default credentials"

- Stelle sicher, dass du ADC eingerichtet hast:
  ```bash
  gcloud auth application-default login --impersonate-service-account=SERVICE_ACCOUNT_EMAIL
  ```

### Credentials abgelaufen

Die ADC-Credentials laufen nach einer Weile ab. Erneuere sie:

```bash
gcloud auth application-default login --impersonate-service-account=SERVICE_ACCOUNT_EMAIL
```

## Nächste Schritte

- Siehe [README.md](README.md) für detaillierte Dokumentation
- Siehe [SETUP.md](SETUP.md) für eine ausführliche Setup-Anleitung

## Hilfe

Bei Problemen:
1. Überprüfe die [Troubleshooting Sektion](README.md#troubleshooting) in der README
2. Überprüfe die [SETUP.md](SETUP.md) für detaillierte Anweisungen
3. Überprüfe die Google Cloud Console für IAM-Berechtigungen

