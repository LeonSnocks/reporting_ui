# Setup-Anleitung: Service Account Impersonation

Diese Anleitung führt dich Schritt für Schritt durch die Einrichtung von Service Account Impersonation für die lokale Entwicklung.

## Überblick

Service Account Impersonation ermöglicht es dir, lokal mit den gleichen Berechtigungen wie in Production zu entwickeln, ohne JSON-Key-Dateien verwenden zu müssen.

## Schritt 1: Service Account erstellen (falls noch nicht vorhanden)

1. Gehe zur [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts?project=snocks-analytics)

2. Klicke auf "Service Account erstellen"

3. Gib einen Namen ein (z.B. `reporting-ui-service-account`)

4. Klicke auf "Erstellen und fortsetzen"

5. **Wichtige Rollen zuweisen:**
   - `BigQuery Data Viewer` (`roles/bigquery.dataViewer`)
   - `BigQuery Job User` (`roles/bigquery.jobUser`)

6. Klicke auf "Fertig"

7. **Notiere dir die Service Account E-Mail-Adresse** (z.B. `reporting-ui-service-account@snocks-analytics.iam.gserviceaccount.com`)

## Schritt 2: Service Account Token Creator Rolle zuweisen

### Option A: Über die Console (Einfach)

1. Gehe zu [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=snocks-analytics)

2. Klicke auf dein Service Account

3. Gehe zum Tab "Berechtigungen"

4. Klicke auf "Zugriff gewähren"

5. Gib bei "Neue Hauptkonten" deine E-Mail-Adresse ein (z.B. `deine-email@domain.com`)

6. Wähle die Rolle: **"Service Account Token Creator"** (`roles/iam.serviceAccountTokenCreator`)

7. Klicke auf "Speichern"

### Option B: Über gcloud CLI

```bash
# Ersetze SERVICE_ACCOUNT_EMAIL mit der E-Mail-Adresse deines Service Accounts
# Ersetze USER_EMAIL mit deiner Google Cloud E-Mail-Adresse
SERVICE_ACCOUNT_EMAIL="reporting-ui-service-account@snocks-analytics.iam.gserviceaccount.com"
USER_EMAIL="deine-email@domain.com"

gcloud iam service-accounts add-iam-policy-binding $SERVICE_ACCOUNT_EMAIL \
  --project=snocks-analytics \
  --role="roles/iam.serviceAccountTokenCreator" \
  --member="user:$USER_EMAIL"
```

## Schritt 3: Lokale Authentifizierung einrichten

1. **Stelle sicher, dass du mit deinem Google-Konto eingeloggt bist:**
   ```bash
   gcloud auth login
   ```

2. **Setze das Projekt:**
   ```bash
   gcloud config set project snocks-analytics
   ```

3. **Richte Application Default Credentials mit Impersonation ein:**
   ```bash
   # Ersetze SERVICE_ACCOUNT_EMAIL mit der E-Mail-Adresse deines Service Accounts
   SERVICE_ACCOUNT_EMAIL="reporting-ui-service-account@snocks-analytics.iam.gserviceaccount.com"
   
   gcloud auth application-default login --impersonate-service-account=$SERVICE_ACCOUNT_EMAIL
   ```

4. Ein Browserfenster öffnet sich:
   - Melde dich mit deinem persönlichen Google-Konto an
   - Autorisiere den Zugriff
   - Die Konfiguration wird lokal gespeichert

## Schritt 4: Überprüfen

1. **Teste die Authentifizierung:**
   ```bash
   gcloud auth application-default print-access-token
   ```
   
   Du solltest ein Access Token sehen.

2. **Teste BigQuery Zugriff:**
   ```bash
   # Ersetze SERVICE_ACCOUNT_EMAIL
   SERVICE_ACCOUNT_EMAIL="reporting-ui-service-account@snocks-analytics.iam.gserviceaccount.com"
   
   gcloud auth print-access-token --impersonate-service-account=$SERVICE_ACCOUNT_EMAIL | \
     curl -H "Authorization: Bearer $(cat)" \
     "https://bigquery.googleapis.com/bigquery/v2/projects/snocks-analytics/datasets"
   ```

3. **Starte die Anwendung:**
   ```bash
   npm run dev
   ```
   
   Die Anwendung sollte jetzt automatisch die Credentials verwenden.

## Schritt 5: Deployment (Cloud Run)

Wenn du die Anwendung auf Cloud Run deployst:

1. **Beim Erstellen des Services:**
   - Gehe zu "Sicherheit & Identität"
   - Wähle das gleiche Service Account aus, das du lokal verwendest
   - Die Anwendung verwendet automatisch das Service Account über den Metadaten-Server

2. **Oder über gcloud:**
   ```bash
   gcloud run deploy reporting-ui \
     --image gcr.io/snocks-analytics/reporting-ui \
     --platform managed \
     --region europe-west1 \
     --service-account SERVICE_ACCOUNT_EMAIL \
     --project snocks-analytics
   ```

## Troubleshooting

### "Permission denied" beim Impersonieren

- Stelle sicher, dass du die `Service Account Token Creator` Rolle hast
- Überprüfe die IAM-Berechtigungen:
  ```bash
  gcloud iam service-accounts get-iam-policy SERVICE_ACCOUNT_EMAIL \
    --project=snocks-analytics
  ```

### "Could not load the default credentials"

- Stelle sicher, dass du ADC eingerichtet hast:
  ```bash
  gcloud auth application-default login --impersonate-service-account=SERVICE_ACCOUNT_EMAIL
  ```

- Überprüfe die Konfiguration:
  ```bash
  cat ~/.config/gcloud/application_default_credentials.json
  ```

### Credentials abgelaufen

Die ADC-Credentials laufen nach einer Weile ab. Erneuere sie mit:
```bash
gcloud auth application-default login --impersonate-service-account=SERVICE_ACCOUNT_EMAIL
```

## Nützliche Befehle

```bash
# Aktuelle ADC-Konfiguration anzeigen
gcloud auth application-default print-access-token

# Aktuelle gcloud Konfiguration anzeigen
gcloud config list

# Service Account Informationen anzeigen
gcloud iam service-accounts describe SERVICE_ACCOUNT_EMAIL \
  --project=snocks-analytics

# IAM-Berechtigungen für Service Account anzeigen
gcloud projects get-iam-policy snocks-analytics \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:SERVICE_ACCOUNT_EMAIL"
```

## Sicherheit

✅ **Keine JSON-Key-Dateien** - Alles wird über ADC verwaltet  
✅ **Keine Credentials im Code** - Alles wird über Umgebungsvariablen oder Metadaten-Server geladen  
✅ **Identische Berechtigungen** - Lokale Entwicklung = Production  
✅ **Audit-Logs** - Alle API-Calls werden in Cloud Audit Logs aufgezeichnet  

## Weitere Ressourcen

- [Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials)
- [Service Account Impersonation](https://cloud.google.com/iam/docs/impersonating-service-accounts)
- [BigQuery Authentication](https://cloud.google.com/bigquery/docs/authentication)

