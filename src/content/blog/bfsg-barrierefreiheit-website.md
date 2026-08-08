---
title: "BFSG ab 2025: Was Ihre Unternehmenswebsite jetzt erfüllen muss"
description: "Das Barrierefreiheitsstärkungsgesetz (BFSG) gilt seit Juni 2025. Wer betroffen ist, was WCAG 2.2 für Ihre Website bedeutet und wie Sie Barrierefreiheit praktisch umsetzen."
pubDate: 2026-03-10
author: "Paul Dunker"
category: "Recht & Technik"
keywords: ["bfsg", "barrierefreiheit website", "barrierefreiheitsstärkungsgesetz", "wcag 2.2", "barrierefreie website pflicht"]
readingTime: 8
---

Seit dem 28. Juni 2025 gilt in Deutschland das Barrierefreiheitsstärkungsgesetz – kurz BFSG. Für viele Unternehmen bedeutet das: Die eigene Website oder der Online-Shop muss bestimmte Anforderungen erfüllen, sonst drohen Abmahnungen oder Bußgelder. Dieser Artikel erklärt, wen das Gesetz trifft, was technisch gefordert wird und welche Maßnahmen in der Praxis sinnvoll sind.

**Hinweis:** Dieser Artikel dient der allgemeinen Information und ersetzt keine Rechtsberatung. Im Zweifel lassen Sie Ihre konkrete Situation rechtlich prüfen.

---

## Was ist das BFSG?

Das Barrierefreiheitsstärkungsgesetz ist die deutsche Umsetzung des europäischen Rechtsakts zur Barrierefreiheit – des sogenannten European Accessibility Act (EAA). Ziel ist es, digitale Produkte und Dienstleistungen für Menschen mit Behinderungen zugänglich zu machen: für Menschen mit eingeschränktem Sehvermögen, mit motorischen Einschränkungen, mit Hörbehinderungen oder mit kognitiven Besonderheiten.

Das BFSG schreibt vor, dass betroffene Anbieter ihre digitalen Angebote nach dem Standard **WCAG 2.2 (Web Content Accessibility Guidelines)** auf der Konformitätsstufe **AA** gestalten müssen. Diese Richtlinien definieren konkrete technische und gestalterische Anforderungen – dazu gleich mehr.

Das Gesetz gilt seit dem **28. Juni 2025**. Wer bis dahin noch keine Anpassungen vorgenommen hat, riskiert im schlechtesten Fall rechtliche Konsequenzen.

---

## Wer ist betroffen – und wer nicht?

Das BFSG gilt nicht pauschal für alle Websites. Es richtet sich in erster Linie an Unternehmen, die **Produkte oder Dienstleistungen elektronisch** anbieten – also vor allem an Online-Shops, digitale Dienstleister und Anbieter mit transaktionalen Online-Angeboten.

**In der Regel betroffen sind zum Beispiel:**

- Online-Shops, die Waren oder digitale Produkte verkaufen
- Anbieter von Software, Apps oder digitalen Diensten mit Vertragsabschluss
- Banken und Finanzdienstleister mit Online-Zugang
- Anbieter von Personenbeförderung mit digitaler Buchung
- Telekommunikationsanbieter

**Reine Informationswebsites** eines kleinen Handwerksbetriebs oder einer lokalen Dienstleistungsfirma ohne Online-Kaufabschluss fallen häufig nicht direkt unter den Anwendungsbereich des BFSG. Hier ist die Abgrenzung aber nicht immer eindeutig – wenn Ihre Website ein Buchungs- oder Bestellsystem enthält, wird es kritischer.

### Die Kleinstunternehmen-Ausnahme

Für **Dienstleistungsanbieter** gilt eine wichtige Ausnahme: Kleinstunternehmen mit **weniger als 10 Mitarbeitenden** und einem **Jahresumsatz oder einer Bilanzsumme von höchstens 2 Millionen Euro** sind bei Dienstleistungen in der Regel von den BFSG-Pflichten ausgenommen.

Diese Ausnahme gilt jedoch ausdrücklich **nicht** für Produkte. Und selbst wenn Sie als Kleinstunternehmen formal ausgenommen sind, empfiehlt es sich, die eigene Situation genau zu prüfen – denn die Abgrenzung, was als "Dienstleistung" im Sinne des Gesetzes gilt, ist nicht immer trivial. Holen Sie im Zweifel eine rechtliche Einschätzung ein.

---

## Was WCAG 2.2 konkret bedeutet

Der technische Maßstab des BFSG ist die WCAG 2.2 in der Konformitätsstufe AA. Diese Richtlinien basieren auf vier Grundprinzipien, die jede zugängliche Website erfüllen soll:

| Prinzip | Bedeutung |
|---|---|
| **Wahrnehmbar** | Inhalte müssen für alle Sinne zugänglich sein |
| **Bedienbar** | Die Website muss ohne Maus nutzbar sein |
| **Verständlich** | Texte und Abläufe müssen klar sein |
| **Robust** | Inhalte müssen mit verschiedenen Technologien funktionieren |

Was das in der Praxis bedeutet, lässt sich gut an konkreten Anforderungen zeigen.

---

## Die wichtigsten maßnahmen im überblick

Hier sind die relevantesten technischen und gestalterischen Punkte, die eine barrierefreie Website nach WCAG 2.2 AA erfüllen sollte:

### Farbe und Kontrast

Text muss einen ausreichenden Kontrast zum Hintergrund haben. WCAG 2.2 AA schreibt für normalen Text ein Kontrastverhältnis von mindestens **4,5:1** vor, für großen Text mindestens **3:1**. Viele Websites scheitern hier schon an hellem Grau auf Weiß – etwas, das sich mit den gängigen Browser-Entwicklertools oder kostenlosen Online-Tools schnell prüfen lässt.

Außerdem dürfen Informationen **nicht ausschließlich durch Farbe** vermittelt werden. Ein Pflichtfeld im Formular zum Beispiel nur durch eine rote Umrandung zu markieren, ist nicht ausreichend – es braucht zusätzlich ein Textsignal.

### Tastaturbedienbarkeit

Alle Funktionen Ihrer Website – Navigation, Formulare, Buttons, Dialoge – müssen ohne Maus, allein mit der Tastatur, bedienbar sein. Das betrifft Menschen, die motorisch eingeschränkt sind und auf Tastaturnavigation oder assistive Technologien angewiesen sind. In der Praxis heißt das: Der sogenannte Fokus (der sichtbare Rahmen um ein aktives Element) muss jederzeit erkennbar sein und sich logisch durch die Seite bewegen.

### Alternativtexte für Bilder

Jedes inhaltlich relevante Bild auf Ihrer Website braucht einen beschreibenden Alternativtext (Alt-Text). Screenreader lesen diesen Text vor, wenn jemand die Seite mit einer Sehbehinderung aufruft. Rein dekorative Bilder können mit einem leeren Alt-Attribut (`alt=""`) versehen werden – das ist korrekt und sagt dem Screenreader: Dieses Bild ist nicht inhaltlich relevant.

### Seitenstruktur und Überschriften

Eine klare Überschriftenhierarchie – H1 für den Seitentitel, H2 für Hauptabschnitte, H3 für Unterabschnitte – ist nicht nur gut für SEO, sondern auch für die Zugänglichkeit. Screenreader nutzen diese Struktur, um Nutzern einen schnellen Überblick über die Seite zu geben und direkt zu Abschnitten zu springen.

### Formulare

Jedes Eingabefeld in einem Kontaktformular oder Bestellprozess muss mit einem **sichtbaren, verknüpften Label** versehen sein. Platzhaltertexte innerhalb des Feldes reichen nicht aus – sie verschwinden, sobald jemand tippt. Ein Feld muss auch dann klar erkennbar sein, wenn es bereits ausgefüllt ist.

### Bewegte Inhalte und Animationen

Wenn Ihre Website automatisch ablaufende Videos, Slider oder Animationen enthält, muss der Nutzer diese **anhalten, stoppen oder ausblenden** können. Dauerhaft laufende Bewegtbilder können für Menschen mit bestimmten Beeinträchtigungen – etwa Epilepsie oder Konzentrationsproblemen – ein Problem sein.

### Screenreader-Kompatibilität

Ihre Website sollte mit gängigen Screenreadern korrekt funktionieren. Das setzt voraus, dass HTML semantisch korrekt eingesetzt wird: Buttons sind `<button>`-Elemente, Links sind `<a>`-Elemente, Tabellen haben Spaltenköpfe. Viele Probleme entstehen, wenn rein gestalterisch gedacht wurde – wenn zum Beispiel ein `<div>` als Button gestylt wird, ohne die nötige Zugänglichkeitsrolle zu erhalten.

---

## Barrierefreiheit ist kein nachteil – sondern ein vorteil

Es lohnt sich, Barrierefreiheit nicht nur als Pflicht zu betrachten. Eine zugängliche Website ist in der Regel auch eine bessere Website – für alle Nutzer.

**Klare Struktur** hilft nicht nur Screenreader-Nutzern, sondern auch Menschen, die Ihre Seite schnell überfliegen. **Gute Farbkontraste** erleichtern das Lesen bei schlechten Lichtverhältnissen oder auf günstigen Displays. **Tastaturbedienbarkeit** kommt auch Power-Usern zugute. Und **beschriftete Formularfelder** reduzieren Eingabefehler für alle.

Dazu kommt: Barrierefreiheit und Suchmaschinenoptimierung überschneiden sich stark. Saubere Überschriftenhierarchie, beschreibende Alt-Texte und semantisch korrektes HTML sind Maßnahmen, die sowohl für WCAG als auch für Google relevant sind. Wenn Sie eine [DSGVO-konforme Website](/blog/dsgvo-konforme-website-checkliste) aufbauen wollen, kommen viele strukturelle Grundlagen ohnehin zusammen – Barrierefreiheit ist dabei ein weiterer Baustein.

Nicht zuletzt erreichen Sie mit einer barrierefreien Website eine **breitere Zielgruppe**. Menschen mit Behinderungen sind auch Kunden, Auftraggeber und Entscheidungsträger.

---

## Wie Sie jetzt vorgehen können

Ein strukturierter Einstieg in das Thema kann so aussehen:

1. **Betroffenheit klären:** Fällt Ihr Angebot unter den Anwendungsbereich des BFSG? Wenn Sie Produkte oder transaktionale Dienstleistungen online anbieten, ist das wahrscheinlich der Fall. Im Zweifel: rechtliche Prüfung.
2. **Status-quo-Analyse:** Prüfen Sie Ihre aktuelle Website auf bekannte Barrieren. Kostenlose Tools wie der WAVE Accessibility Checker oder Lighthouse in den Chrome-Entwicklertools geben einen ersten Anhaltspunkt – sind aber kein vollständiger Ersatz für eine manuelle Prüfung.
3. **Priorisieren:** Nicht alles muss sofort perfekt sein. Fokussieren Sie sich auf die größten Hürden: fehlende Alt-Texte, unzureichende Kontraste, nicht beschriftete Formularfelder.
4. **Barrierefreiheitserklärung:** Das BFSG verlangt in der Regel auch eine öffentliche Erklärung zur Barrierefreiheit auf Ihrer Website – vergleichbar mit einer Datenschutzerklärung.
5. **Technisch sauber umsetzen:** Wenn Ihre Website auf einem modernen CMS oder Framework basiert, sind viele Anpassungen machbar – manchmal reicht es, Themes oder Templates zu optimieren. Bei grundlegenden strukturellen Problemen hilft ein Neuaufbau.

Wenn Sie sich fragen, wie Sie bei der Auswahl eines Dienstleisters vorgehen sollen, der Barrierefreiheit wirklich versteht: Der Artikel über die [richtige Webdesign-Agentur finden](/blog/webdesign-agentur-muenchen-auswahl) gibt Ihnen dafür eine Orientierung.

---

## Fazit

Das BFSG ist keine Empfehlung, sondern seit dem 28. Juni 2025 geltendes Recht. Viele Unternehmen, die Produkte oder Dienstleistungen über das Internet anbieten, sind betroffen – auch wenn es Ausnahmen für Kleinstunternehmen gibt, die im Einzelfall geprüft werden müssen.

Die technischen Anforderungen nach WCAG 2.2 AA sind konkret und umsetzbar: Kontraste, Tastaturbedienung, Alt-Texte, klare Struktur, beschriftete Formulare. Wer diese Grundlagen ernst nimmt, schafft nicht nur eine rechtssichere, sondern auch eine bessere Website.

Wenn Sie nicht sicher sind, wo Ihre Website steht, oder wenn Sie einen Neustart in Richtung barrierefreies Webdesign planen: Sprechen Sie uns gerne unverbindlich an – [zum Kontakt](/#kontakt).
