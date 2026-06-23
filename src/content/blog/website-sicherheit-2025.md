---
title: "Website-Sicherheit 2025: Was KMU jetzt tun müssen"
description: "Wie Unternehmen ihre Website vor den häufigsten Angriffen schützen – praxisnah und ohne IT-Expertenwissen."
pubDate: 2025-08-01
author: "Paul Dunker"
category: "Technik"
keywords: ["website sicherheit 2025", "website schützen kmu", "wordpress sicherheit", "website hacking verhindern", "webseiten sicherheit"]
readingTime: 6
---

Cyberangriffe treffen nicht nur Großunternehmen. KMU sind zunehmend Ziel von automatisierten Angriffen – nicht wegen ihres Wertes, sondern wegen ihrer oft mangelhaften Sicherheit. Wer keine Maßnahmen trifft, macht es Angreifern leicht.

## Warum KMU-Websites angegriffen werden

Viele Angriffe sind nicht gezielt, sondern automatisiert. Bots durchsuchen das Internet nach bekannten Sicherheitslücken – in veralteten WordPress-Versionen, schwachen Passwörtern, nicht aktualisierten Plugins. Wer diese Lücken hat, wird früher oder später erwischt.

Die häufigsten Folgen:
- Weiterleitung der Website auf Spam-Seiten (für Besucher unsichtbar)
- Einschleusung von Malware, die Besucher infiziert
- Datendiebstahl (Kundendaten, Zugangsdaten)
- Blacklisting durch Google (Website wird als gefährlich markiert)
- Ransomware und Erpressung

## Die wichtigsten Schutzmaßnahmen

### 1. Updates konsequent durchführen

Die meisten erfolgreichen Angriffe nutzen bekannte Sicherheitslücken, für die es bereits Patches gibt – die aber nicht eingespielt wurden.

**Was tun:**
- WordPress-Kern, Themes und Plugins regelmäßig aktualisieren
- Automatische Updates aktivieren (zumindest für Sicherheits-Updates)
- Nicht mehr genutzte Plugins und Themes löschen (nicht nur deaktivieren)

### 2. Starke Passwörter und Zwei-Faktor-Authentifizierung

Brute-Force-Angriffe probieren tausende Passwörter pro Minute aus. Schwache Passwörter werden schnell geknackt.

**Was tun:**
- Passwörter mit mindestens 16 Zeichen, Großbuchstaben, Zahlen, Sonderzeichen
- Passwort-Manager nutzen (Bitwarden, 1Password)
- Zwei-Faktor-Authentifizierung für CMS-Zugänge aktivieren
- Keine Wiederverwendung von Passwörtern

### 3. SSL/HTTPS – und richtig konfiguriert

HTTPS verschlüsselt die Verbindung zwischen Besucher und Website. Das ist inzwischen Standard, aber nicht jede Implementierung ist korrekt.

**Was prüfen:**
- SSL-Zertifikat aktuell? (Automatische Verlängerung einrichten)
- HTTP-Anfragen auf HTTPS umleiten (301-Weiterleitung)
- HSTS-Header aktivieren (teilt dem Browser mit, HTTPS zu erzwingen)

### 4. Login-Seite absichern

Die Login-Seite ist das primäre Angriffsziel. Bei WordPress: `/wp-admin` und `/wp-login.php` sind bekannte URLs.

**Was tun:**
- Login-URL ändern (z.B. via Security-Plugins)
- Fehlerhafte Anmeldeversuche begrenzen (Login Lockdown)
- XML-RPC deaktivieren, wenn nicht gebraucht (häufiger Angriffsvektor)

### 5. Regelmäßige Backups

Wenn alle anderen Maßnahmen versagen, ist ein aktuelles Backup die letzte Rettung.

**Was tun:**
- Tägliche automatische Backups des CMS und der Datenbank
- Backups außerhalb des Servers speichern (Cloud-Speicher, anderer Server)
- Regelmäßig testen, ob Backups wiederhergestellt werden können

### 6. Security Headers setzen

HTTP Security Headers sind Anweisungen an den Browser, die bestimmte Angriffsvektoren schließen.

Die wichtigsten:
- **Content Security Policy (CSP):** Verhindert das Nachladen von externen Skripten
- **X-Content-Type-Options:** Verhindert MIME-Sniffing
- **X-Frame-Options:** Verhindert Clickjacking
- **Referrer-Policy:** Kontrolliert, welche Referrer-Informationen übermittelt werden

Diese lassen sich im Server-Config oder über Plugins setzen. Ob sie gesetzt sind, prüft man mit securityheaders.com.

### 7. Web Application Firewall (WAF)

Eine WAF filtert bösartige Anfragen heraus, bevor sie den Server erreichen.

Optionen für KMU:
- **Cloudflare (kostenfreier Tarif):** Bietet grundlegenden DDoS-Schutz und WAF
- **Wordfence (für WordPress):** Plugin mit WAF-Funktion
- **Sucuri:** Spezialisierter Security-Service

### 8. Datenbankzugang absichern

Die Datenbank enthält alle sensiblen Daten.

**Was tun:**
- Datenbankbenutzer mit minimalen Rechten (nur notwendige Berechtigungen)
- Datenbank nicht aus dem Internet direkt erreichbar (nur lokaler Zugriff)
- Standard-Datenbankpräfix ändern (bei WordPress: nicht `wp_` als Tabellen-Präfix)

## Was Sie sofort prüfen können

1. Öffnen Sie Ihre Website mit `https://` – erscheint ein Schloss-Symbol? ✓
2. Gehen Sie zu securityheaders.com – welche Bewertung bekommt Ihre Website?
3. Überprüfen Sie in Ihrem CMS: Sind alle Plugins und WordPress-Version aktuell?
4. Wann war das letzte Backup, und wo ist es gespeichert?

## Fazit

Website-Sicherheit ist kein Einmalprojekt, sondern kontinuierliche Pflege. Die meisten Angriffe auf KMU-Websites nutzen bekannte, behebbare Sicherheitslücken. Wer Updates einspielt, starke Passwörter nutzt und regelmäßig Backups macht, ist besser geschützt als die Mehrheit. Wenn Sie Ihre Website-Sicherheit professionell prüfen und verbessern lassen möchten, hilft MediaDrift. Sprechen Sie uns an.
