# Fix für Credentials Problem

## Problem

Die Umgebungsvariable `GOOGLE_APPLICATION_CREDENTIALS` ist in deiner `.zshrc` gesetzt und zeigt auf eine nicht vorhandene Datei. Das verhindert, dass Application Default Credentials (ADC) funktionieren.

## Lösung

### Schritt 1: Entferne die Umgebungsvariable aus .zshrc

Öffne deine `.zshrc` Datei:
```bash
nano ~/.zshrc
# oder
code ~/.zshrc
```

Finde und entferne oder kommentiere diese Zeile aus:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/Keys/my-sa.json"
```

Füge stattdessen einen Kommentar hinzu (optional):
```bash
# GOOGLE_APPLICATION_CREDENTIALS wird nicht mehr benötigt
# Die Anwendung verwendet Application Default Credentials (ADC) mit Service Account Impersonation
```

### Schritt 2: Lade die Shell-Konfiguration neu

```bash
source ~/.zshrc
```

### Schritt 3: Richte Application Default Credentials neu ein

```bash
cd /Users/leon/.cursor/worktrees/Reporting_UI/r3nqC

# Entferne die Umgebungsvariable für diese Session
unset GOOGLE_APPLICATION_CREDENTIALS

# Richte ADC mit Impersonation ein
gcloud auth application-default login --impersonate-service-account=snocks-analytics@appspot.gserviceaccount.com
```

### Schritt 4: Teste die Credentials

```bash
# Sollte ein Access Token ausgeben
gcloud auth application-default print-access-token | head -c 50
```

### Schritt 5: Starte die Anwendung

```bash
npm run dev
```

## Status der Berechtigungen

✅ **Service Account Token Creator Rolle**: Zugewiesen für `leon@snocks.com`  
✅ **BigQuery Data Viewer Rolle**: Service Account hat diese Rolle  
✅ **BigQuery Job User Rolle**: Service Account hat diese Rolle  
✅ **Application Default Credentials**: Wurden eingerichtet (nachdem GOOGLE_APPLICATION_CREDENTIALS entfernt wurde)

## Wenn es immer noch nicht funktioniert

1. Überprüfe, ob die Service Account Token Creator Rolle korrekt zugewiesen ist:
   ```bash
   gcloud iam service-accounts get-iam-policy snocks-analytics@appspot.gserviceaccount.com \
     --project=snocks-analytics
   ```

2. Überprüfe, ob du mit dem richtigen Account eingeloggt bist:
   ```bash
   gcloud config get-value account
   ```
   
   Sollte `leon@snocks.com` sein.

3. Teste die Impersonation direkt:
   ```bash
   gcloud auth print-access-token --impersonate-service-account=snocks-analytics@appspot.gserviceaccount.com
   ```

## Alternative: Ohne Impersonation (falls Impersonation Probleme macht)

Falls Service Account Impersonation Probleme macht, kannst du auch direkt mit deinem Benutzerkonto arbeiten (falls du die notwendigen BigQuery Berechtigungen hast):

```bash
gcloud auth application-default login
```

Die Anwendung wird dann mit deinen persönlichen Berechtigungen laufen.

