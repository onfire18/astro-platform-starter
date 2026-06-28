---
title: "Strukturierte Daten und Schema Markup: So sehen Sie bei Google besser aus"
description: "Was strukturierte Daten sind, wie Schema Markup die Google-Suchergebnisse beeinflusst und welche Typen für KMU am wichtigsten sind."
pubDate: 2026-04-30
author: "Paul Dunker"
category: "Technik"
keywords: ["strukturierte daten seo", "schema markup website", "rich snippets google", "json-ld website", "schema.org kmu"]
readingTime: 5
---

Wenn Sie bei Google suchen, sehen Sie manchmal Ergebnisse mit Sternen, Öffnungszeiten, FAQs oder Preisangaben direkt in den Suchergebnissen – noch bevor Sie eine Website besuchen. Das sind Rich Snippets, und sie entstehen durch strukturierte Daten: ein Code-Format, das Google erklärt, was auf der Seite zu finden ist.

Für Unternehmen, die in diesen erweiterten Suchergebnissen erscheinen, ist das ein erheblicher Vorteil: höhere Sichtbarkeit, mehr Klicks, mehr Vertrauen.

## Was strukturierte Daten sind

Strukturierte Daten sind maschinenlesbarer Code auf einer Webseite, der Informationen in einem standardisierten Format beschreibt. Google, Bing und andere Suchmaschinen können diesen Code auslesen und die Informationen zur Anreicherung der Suchergebnisse nutzen.

Das gängigste Format: JSON-LD (JavaScript Object Notation for Linked Data). Es wird im `<head>` der Seite eingefügt und beeinflusst nicht das visuelle Erscheinungsbild der Website.

Das Vokabular kommt von schema.org – einer gemeinsamen Initiative von Google, Microsoft, Yahoo und Yandex.

## Welche Schema-Typen für KMU am wichtigsten sind

**LocalBusiness.** Der wichtigste Typ für lokale Unternehmen. Beschreibt Name, Adresse, Telefonnummer, Öffnungszeiten, Koordinaten und Branche. Verbessert die Darstellung in lokalen Google-Suchergebnissen.

**FAQPage.** Macht FAQ-Inhalte als aufklappbare Fragen direkt in den Suchergebnissen sichtbar. Das vergrößert den Platz in den Suchergebnissen erheblich und erhöht die Klickrate.

**Article.** Für Blog-Artikel und Nachrichteninhalte. Teilt Google mit, dass es sich um journalistischen oder redaktionellen Inhalt handelt, mit Autor und Erscheinungsdatum.

**Product.** Für E-Commerce: Beschreibt Produkte mit Preis, Verfügbarkeit, Bewertungen. Google zeigt diese Informationen im Shopping-Bereich und in den Suchergebnissen.

**Review / AggregateRating.** Zeigt Sternebewertungen in den Suchergebnissen. Achtung: Google hat die Richtlinien verschärft – Bewertungen dürfen nur von echten Nutzern stammen, nicht selbst vergeben sein.

**BreadcrumbList.** Zeigt die Seitenstruktur als Breadcrumb-Navigation in den Suchergebnissen: z.B. „Startseite > Blog > Artikel-Titel."

**Service.** Beschreibt spezifische Dienstleistungen mit Beschreibung, Preisangaben und Anbieterdaten.

## Ein einfaches LocalBusiness-Beispiel

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Musterfirma GmbH",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Musterstraße 1",
    "addressLocality": "München",
    "postalCode": "80331",
    "addressCountry": "DE"
  },
  "telephone": "+49 89 123456",
  "openingHours": ["Mo-Fr 09:00-18:00"],
  "url": "https://www.musterfirma.de"
}
```

Dieser Code im `<head>` der Website teilt Google alle wesentlichen Unternehmensdaten mit.

## Wie Sie prüfen, ob Ihre strukturierten Daten korrekt sind

Google stellt den Rich Results Test bereit (search.google.com/test/rich-results). Dort können Sie eine URL eingeben und sehen, ob Google strukturierte Daten erkennt und ob Fehler vorhanden sind.

Schema Markup Validator (validator.schema.org) prüft die technische Korrektheit des Codes.

## Wichtige Einschränkungen

Strukturierte Daten sind keine Garantie für Rich Snippets. Google entscheidet, ob es die erweiterten Suchergebnisse anzeigt – auch wenn der Code korrekt implementiert ist. Die Wahrscheinlichkeit steigt mit technischer Korrektheit, Relevanz und Qualität der Seite insgesamt.

Außerdem: Schema Markup darf keine irreführenden oder falschen Informationen enthalten. Google prüft zunehmend, ob der strukturierte Inhalt mit dem tatsächlich sichtbaren Seiteninhalt übereinstimmt.

## Wie aufwendig ist die Implementierung?

Für eine einzelne Seite (z.B. LocalBusiness auf der Startseite) ist JSON-LD-Code in wenigen Minuten geschrieben und eingefügt. Für komplexere Setups (mehrere Standorte, viele Produktseiten, dynamische Inhalte) ist mehr Aufwand nötig.

WordPress-Plugins wie Yoast SEO oder Rank Math generieren automatisch strukturierte Daten für viele Seitentypen – ein guter Einstieg ohne manuellen Code.

## Fazit

Strukturierte Daten sind ein technischer SEO-Hebel mit sichtbaren Ergebnissen: erweiterter Platz in den Suchergebnissen, höhere Klickraten, bessere Darstellung. Für KMU ist zumindest LocalBusiness-Markup eine klare Empfehlung. Wenn Sie strukturierte Daten professionell auf Ihrer Website implementieren möchten, hilft MediaDrift. Sprechen Sie uns an.
