# Automation Reporting Dashboard

Eine moderne Web-Anwendung für das Automation Reporting, die Daten aus BigQuery abruft und in einem übersichtlichen Dashboard visualisiert.

## Features

- **Projekt Performance Tabelle**: Übersicht aller Projekte mit Net Revenue, Kosten und ROI
- **Wöchentliches Balkendiagramm**: Zeigt die wöchentliche Performance eines ausgewählten Projekts
- **Kumulatives Liniendiagramm**: Visualisiert die kumulative Performance über die Zeit
- **Impact Werte**: Zeigt den Impact dieser Woche und der letzten Woche
- **Projektimpact Tabelle**: Detaillierte Aufschlüsselung des Impacts pro Projekt für die letzte Woche
- **Nomenklatur Informationen**: Erläuterungen zur Berechnung der Net Revenue Werte

## Technologie Stack

- **Next.js 14**: React Framework mit App Router
- **TypeScript**: Typsichere Entwicklung
- **Tailwind CSS**: Modernes Styling
- **Recharts**: Chart-Bibliothek für Visualisierungen
- **BigQuery**: Google Cloud BigQuery für Datenabfragen
- **Application Default Credentials (ADC)**: Sichere Authentifizierung ohne JSON-Keys

## Setup

### Voraussetzungen

- Node.js 18+ installiert
- Google Cloud SDK (`gcloud`) installiert
- Zugriff auf die BigQuery Tabellen:
  - `snocks-analytics.marts_automation_euw3.automation_eval`
  - `snocks-analytics.marts_automation_euw3.automation_eval_kw`
- Ein Service Account mit BigQuery-Zugriff

### Installation

1. **Dependencies installieren:**
```bash
npm install
```

2. **Google Cloud SDK installieren** (falls noch nicht vorhanden):
```bash
# macOS
brew install google-cloud-sdk

# Oder von https://cloud.google.com/sdk/docs/install
```

3. **Service Account Impersonation einrichten:**

   Diese Methode vermeidet lokale JSON-Key-Dateien komplett und verwendet Application Default Credentials (ADC) mit Service Account Impersonation.

   **Schritt 1: Service Account erstellen (falls noch nicht vorhanden)**
   
   Gehe zur [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts?project=snocks-analytics):
   - Erstelle einen neuen Service Account oder wähle einen bestehenden
   - Stelle sicher, dass der Service Account folgende Rollen hat:
     - `roles/bigquery.dataViewer` (zum Lesen von BigQuery Daten)
     - `roles/bigquery.jobUser` (zum Ausführen von BigQuery Jobs)

   **Schritt 2: Service Account Token Creator Rolle zuweisen**
   
   Gewähre deinem Benutzerkonto (z.B. `deine-email@domain.com`) die Berechtigung, das Service Account zu impersonieren:
   
   ```bash
   # Ersetze SERVICE_ACCOUNT_EMAIL mit der E-Mail-Adresse deines Service Accounts
   # Ersetze USER_EMAIL mit deiner Google Cloud E-Mail-Adresse
   gcloud iam service-accounts add-iam-policy-binding SERVICE_ACCOUNT_EMAIL \
     --project=snocks-analytics \
     --role="roles/iam.serviceAccountTokenCreator" \
     --member="user:USER_EMAIL"
   ```
   
   **Alternativ über die Console:**
   - Gehe zu IAM & Verwaltung > Dienstkonten
   - Wähle dein Service Account aus
   - Klicke auf "Berechtigungen" Tab
   - Klicke auf "Zugriff gewähren"
   - Gib deine E-Mail-Adresse ein
   - Wähle die Rolle: **"Service Account Token Creator"**
   - Speichern

   **Schritt 3: Lokale Authentifizierung mit Impersonation**
   
   Authentifiziere dich lokal so, dass du das Service Account impersonieren kannst:
   
   ```bash
   # Ersetze SERVICE_ACCOUNT_EMAIL mit der E-Mail-Adresse deines Service Accounts
   gcloud auth application-default login --impersonate-service-account=SERVICE_ACCOUNT_EMAIL
   ```
   
   Ein Browserfenster öffnet sich:
   - Melde dich mit deinem persönlichen Google-Konto an
   - gcloud speichert die Konfiguration lokal
   - Alle Google Cloud API-Calls verwenden jetzt automatisch das Service Account über Impersonation

   **Schritt 4: Projekt setzen (optional)**
   
   ```bash
   gcloud config set project snocks-analytics
   ```

4. **Entwicklungsserver starten:**
```bash
npm run dev
```

5. **Dashboard öffnen:**
   Öffne [http://localhost:3000](http://localhost:3000) im Browser

## Wie funktioniert die Authentifizierung?

Die Anwendung verwendet **Application Default Credentials (ADC)**, die automatisch nach Credentials in folgender Reihenfolge suchen:

1. **GOOGLE_APPLICATION_CREDENTIALS** Umgebungsvariable (falls gesetzt)
2. **Application Default Credentials (ADC)** - für lokale Entwicklung
   - Wird durch `gcloud auth application-default login --impersonate-service-account` gesetzt
   - Verwendet Service Account Impersonation
3. **Google Cloud Metadaten-Server** - für Production (Cloud Run, GCE, etc.)
   - Funktioniert automatisch, wenn die Anwendung auf GCP läuft
   - Verwendet das Service Account, das dem Service zugewiesen ist

### Vorteile dieser Methode:

✅ **Keine JSON-Key-Dateien** - Nichts kann versehentlich in Git eingecheckt werden  
✅ **Identische Berechtigungen** - Lokale Entwicklung mit exakt den gleichen Berechtigungen wie Production  
✅ **Nahtloser Übergang** - Keine Code-Änderungen beim Wechsel von lokal zu Production  
✅ **Sicherheit** - Keine Credentials im Code oder Repository  

## Projektstruktur

```
├── app/
│   ├── api/           # API Routes für BigQuery Datenabfragen
│   ├── globals.css    # Globale Styles
│   ├── layout.tsx     # Root Layout
│   └── page.tsx       # Hauptdashboard Seite
├── components/        # React Komponenten
│   ├── ProjectPerformanceTable.tsx
│   ├── WeeklyBarChart.tsx
│   ├── CumulativeLineChart.tsx
│   ├── ImpactValues.tsx
│   ├── LastWeekImpactTable.tsx
│   └── NomenclatureInfo.tsx
├── lib/
│   ├── bigquery.ts    # BigQuery Client und Abfragen (verwendet ADC)
│   └── utils.ts       # Utility Funktionen
└── types/
    └── data.ts        # TypeScript Typen
```

## BigQuery Tabellen

### automation_eval
Enthält die Projekt Performance Daten:
- `project`: Projektname
- `total_net_revenue`: Gesamter Net Revenue
- `total_cost`: Gesamtkosten
- `roi`: Return on Investment
- `created_at`: Erstellungsdatum

### automation_eval_kw
Enthält die wöchentlichen Daten:
- `project`: Projektname
- `iso_year`: ISO Jahr
- `iso_week`: ISO Woche
- `week_start`: Wochenstart
- `week_last_ts`: Letzter Timestamp der Woche
- `cum_revenue`: Kumulativer Revenue
- `cum_cost`: Kumulative Kosten
- `roi`: ROI
- `weekly_revenue`: Wöchentlicher Revenue

## Entwicklung

### Build für Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Credentials überprüfen
```bash
# Zeige aktuelle ADC Credentials
gcloud auth application-default print-access-token

# Zeige aktuelle gcloud Konfiguration
gcloud config list
```

## Deployment

### Google Cloud Run (Empfohlen)

1. **Service Account zuweisen:**
   Beim Erstellen oder Aktualisieren des Cloud Run Services:
   - Gehe zu "Sicherheit & Identität"
   - Wähle das gleiche Service Account aus, das du lokal verwendest
   - Die Anwendung verwendet automatisch das Service Account über den Metadaten-Server

2. **Deploy:**
   ```bash
   # Build Docker Image
   docker build -t gcr.io/snocks-analytics/reporting-ui .

   # Push zu Container Registry
   docker push gcr.io/snocks-analytics/reporting-ui

   # Deploy zu Cloud Run
   gcloud run deploy reporting-ui \
     --image gcr.io/snocks-analytics/reporting-ui \
     --platform managed \
     --region europe-west1 \
     --service-account SERVICE_ACCOUNT_EMAIL \
     --project snocks-analytics
   ```

### Vercel

Für Vercel benötigst du eine andere Authentifizierungsmethode:
- Verwende die `GOOGLE_APPLICATION_CREDENTIALS` Umgebungsvariable
- Oder verwende Workload Identity Federation (für Production)

## Troubleshooting

### "Permission denied" Fehler

1. Überprüfe, ob du die Service Account Token Creator Rolle hast:
   ```bash
   gcloud iam service-accounts get-iam-policy SERVICE_ACCOUNT_EMAIL \
     --project=snocks-analytics
   ```

2. Überprüfe, ob das Service Account die notwendigen BigQuery Berechtigungen hat:
   ```bash
   gcloud projects get-iam-policy snocks-analytics \
     --flatten="bindings[].members" \
     --filter="bindings.members:serviceAccount:SERVICE_ACCOUNT_EMAIL"
   ```

3. Teste die Authentifizierung:
   ```bash
   gcloud auth application-default print-access-token
   ```

### "Could not load the default credentials" Fehler

1. Stelle sicher, dass du ADC eingerichtet hast:
   ```bash
   gcloud auth application-default login --impersonate-service-account=SERVICE_ACCOUNT_EMAIL
   ```

2. Überprüfe die ADC-Konfiguration:
   ```bash
   cat ~/.config/gcloud/application_default_credentials.json
   ```

### Credentials erneuern

Die ADC-Credentials laufen nach einer Weile ab. Erneuere sie mit:
```bash
gcloud auth application-default login --impersonate-service-account=SERVICE_ACCOUNT_EMAIL
```

## License

MIT
