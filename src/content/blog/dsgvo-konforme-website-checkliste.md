---
title: "DSGVO-konforme Website: Die praktische Checkliste für Unternehmen"
description: "Datenschutz auf der eigenen Website richtig umsetzen: Cookie-Banner, Datenschutzerklärung, Fonts, Analytics und Co. Die verständliche Checkliste für KMU."
pubDate: 2026-04-08
author: "Paul Dunker"
category: "Recht & Technik"
keywords: ["dsgvo website", "dsgvo konforme website", "datenschutz website", "cookie banner", "website datenschutzerklärung"]
readingTime: 9
---

Die eigene Website ist das Aushängeschild Ihres Unternehmens — aber sie ist auch ein Ort, an dem täglich Daten anfallen. Besucher hinterlassen Spuren: Browser-Informationen, IP-Adressen, Klickpfade. Wer das als Unternehmen ignoriert oder unzureichend handhabt, riskiert nicht nur Ärger mit Behörden, sondern verliert auch das Vertrauen seiner Kunden.

Diese Checkliste hilft Ihnen, die wesentlichen Datenschutzpflichten für Ihre Website zu verstehen und strukturiert anzugehen. Sie richtet sich an Unternehmen, die ihre Website selbst betreiben oder gerade neu gestalten lassen.

**Wichtiger Hinweis:** Dieser Artikel ersetzt keine Rechtsberatung. Im Zweifel sollten Sie einen Fachanwalt für IT-Recht oder einen zertifizierten Datenschutzbeauftragten hinzuziehen — gerade wenn Sie sensible Daten verarbeiten oder Ihren Kunden gegenüber besondere Sorgfaltspflichten haben.

---

## Warum Datenschutz auf der Website Pflicht ist

Die Datenschutz-Grundverordnung (DSGVO) gilt EU-weit seit Mai 2018. Sie regelt, wie personenbezogene Daten erhoben, gespeichert und verarbeitet werden dürfen. Für Website-Betreiber bedeutet das: Jede Datenverarbeitung braucht eine Rechtsgrundlage — entweder eine Einwilligung der Nutzer, ein berechtigtes Interesse oder einen anderen anerkannten Grund.

Das klingt abstrakt, wird aber sehr konkret, sobald Sie sich anschauen, was auf einer typischen Unternehmenswebsite alles passiert: Schriftarten werden von externen Servern geladen, Analytics-Tools zeichnen das Nutzerverhalten auf, eingebettete Videos übermitteln beim Abspielen Daten an Plattformbetreiber. Viele dieser Vorgänge sind ohne aktive Einwilligung nicht zulässig.

Die gute Nachricht: Mit der richtigen Vorbereitung lässt sich das alles sauber umsetzen. Die folgende Checkliste gibt Ihnen einen strukturierten Überblick.

---

## Checkliste: HTTPS und sichere Übertragung

Eine verschlüsselte Verbindung ist die Grundlage jeder datenschutzfreundlichen Website. Ohne sie werden alle Daten, die Besucher übermitteln, ungeschützt übertragen.

- Ihre Website ist ausschließlich über HTTPS erreichbar
- Das SSL/TLS-Zertifikat ist gültig und wird regelmäßig erneuert
- HTTP-Aufrufe werden automatisch auf HTTPS weitergeleitet
- Formulardaten (Kontakt, Newsletter, Login) werden verschlüsselt übertragen

Ein abgelaufenes Zertifikat oder eine gemischte HTTP/HTTPS-Seite (sogenannte "Mixed Content"-Warnungen) signalisiert Nutzern und Suchmaschinen gleichermaßen Unsorgfalt.

---

## Checkliste: Schriftarten und externe Ressourcen

Einer der häufigsten Datenschutzfehler auf Websites ist das Laden von Schriftarten über externe Dienste — etwa Google Fonts oder Adobe Fonts. Dabei wird beim Seitenaufruf eine Anfrage an Server des Anbieters gestellt, die in der Regel die IP-Adresse des Besuchers übermittelt. Das geschieht ohne Einwilligung und ist nach aktuellem Stand problematisch.

- Schriftarten sind lokal auf Ihrem Server gespeichert und werden von dort geladen
- Es werden keine Ressourcen (Fonts, Icons, CSS-Bibliotheken) von externen CDNs ohne Einwilligung eingebunden
- Eingebettete Karten (z.B. Google Maps) werden erst nach Nutzereinwilligung aktiviert oder durch datenschutzfreundliche Alternativen ersetzt
- Social-Media-Buttons laden keine externen Inhalte beim Seitenaufruf, sondern erst auf Klick oder nach Einwilligung
- Eingebettete Videos (YouTube, Vimeo) sind im erweiterten Datenschutzmodus eingebunden oder hinter einer Consent-Schranke

Der Aufwand, Schriftarten lokal zu hosten, ist gering — der Datenschutzgewinn ist erheblich.

---

## Checkliste: Cookie-Banner und Einwilligung

Das Thema Cookie-Banner ist vermutlich das sichtbarste Datenschutzthema auf Websites. Und gleichzeitig das, bei dem am häufigsten Fehler gemacht werden.

Ein rechtlich einwandfreier Cookie-Banner muss echte Wahlmöglichkeiten bieten: Ablehnen muss genauso einfach sein wie Annehmen. Ein kleiner "Alle akzeptieren"-Button mit einem versteckten "Ablehnen"-Link im Kleingedruckten genügt nicht.

- Der Cookie-Banner erscheint beim ersten Besuch, bevor Cookies oder Tracking gesetzt werden
- Es gibt eine gut sichtbare Möglichkeit, alle nicht notwendigen Cookies abzulehnen
- Einwilligungen werden nicht vorab angehakt (kein "Opt-out", sondern "Opt-in")
- Die gegebene Einwilligung wird gespeichert und ist widerrufbar (z.B. über einen Link in der Datenschutzerklärung oder im Footer)
- Technisch notwendige Cookies (z.B. für den Login oder den Warenkorb) sind von der Einwilligungspflicht ausgenommen und klar als solche gekennzeichnet
- Das eingesetzte Consent-Management-System protokolliert Einwilligungen revisionssicher

Ein gutes Consent-Management-Tool nimmt Ihnen hier viel Arbeit ab. Es gibt sowohl kostenpflichtige als auch kostenlose Optionen, die sich in bestehende Websites integrieren lassen.

---

## Checkliste: Analytics und Marketing-Tools

Webanalyse ist für viele Unternehmen wichtig — aber die klassische Implementierung von Google Analytics ohne vorherige Einwilligung ist in Deutschland seit Jahren rechtlich umstritten und wurde von mehreren Datenschutzbehörden als unzulässig eingestuft.

- Analytics-Tools werden erst geladen, nachdem der Nutzer eingewilligt hat
- Das eingesetzte Analytics-Tool ist entweder DSGVO-freundlich konfiguriert (z.B. mit IP-Anonymisierung und ohne Cross-Site-Tracking) oder durch eine datenschutzfreundliche Alternative ersetzt
- Marketing-Pixel (Facebook Pixel, LinkedIn Insight Tag etc.) werden ebenfalls nur nach Einwilligung aktiviert
- Mit dem jeweiligen Anbieter besteht ein Auftragsverarbeitungsvertrag (AVV)
- Daten werden, soweit möglich, nicht in Drittländer außerhalb der EU/des EWR übertragen — oder es bestehen geeignete Garantien für die Übertragung

Datenschutzfreundliche Analytics-Alternativen wie Matomo (selbst gehostet) oder Plausible ermöglichen grundlegende Auswertungen, ohne auf Einwilligungen angewiesen zu sein — vorausgesetzt, sie sind korrekt konfiguriert.

---

## Checkliste: Datenschutzerklärung und Impressum

Die Datenschutzerklärung ist kein optionales Dokument. Sie ist Pflicht und muss vollständig, verständlich und aktuell sein.

- Die Datenschutzerklärung ist von jeder Seite der Website aus erreichbar (in der Regel im Footer)
- Sie enthält Angaben zu: Verantwortlichem, verarbeiteten Daten, Zwecken der Verarbeitung, Rechtsgrundlagen, Speicherdauern, eingesetzten Drittdiensten, Betroffenenrechten und Beschwerdemöglichkeiten
- Die Erklärung ist in verständlicher Sprache geschrieben, ohne übermäßigen Juristenjargon
- Sie wird aktualisiert, wenn sich etwas an der Datenverarbeitung ändert (neues Tool, neue Funktion)
- Das Impressum ist ebenfalls von jeder Seite aus erreichbar und enthält alle gesetzlich vorgeschriebenen Angaben
- Impressum und Datenschutzerklärung sind separate Seiten oder zumindest klar voneinander getrennt

Automatisch generierte Datenschutzerklärungen aus dem Internet sind ein Ausgangspunkt, aber kein Ersatz für eine auf Ihre Website zugeschnittene Erklärung.

---

## Checkliste: Kontaktformulare

Kontaktformulare sind ein häufig unterschätzter Datenschutzbereich. Wer ein Formular ausfüllt, übermittelt personenbezogene Daten — und hat ein Recht darauf zu wissen, was damit passiert.

- Das Kontaktformular enthält nur die Felder, die für die Kontaktaufnahme tatsächlich nötig sind (Datensparsamkeit)
- Es gibt einen Pflichthinweis auf die Datenschutzerklärung mit direktem Link
- Das Formular überträgt Daten verschlüsselt (HTTPS)
- Eingehende Nachrichten werden nicht länger gespeichert als nötig
- Wenn der Formularanbieter ein externer Dienst ist (z.B. ein SaaS-Anbieter), besteht ein AVV

Felder wie "Geburtsdatum", "Telefonnummer" oder "Adresse" sollten nur dann abgefragt werden, wenn sie für die Bearbeitung der Anfrage wirklich erforderlich sind.

---

## Häufige Fehler, die sich leicht vermeiden lassen

Aus der Praxis zeigen sich einige Muster, die immer wieder auftauchen:

- **Google Fonts direkt aus dem CDN laden** — statt selbst zu hosten. Das ist einer der am häufigsten abgemahnten Punkte.
- **Cookie-Banner, die nur "Alle akzeptieren" anbieten** — ohne gleichwertige Ablehnmöglichkeit.
- **Analytics ohne Consent aktiv** — weil das Tracking bereits vor dem Banner-Klick startet.
- **Veraltete Datenschutzerklärung** — die noch Tools oder Dienste erwähnt, die längst nicht mehr eingesetzt werden, oder aktuelle Dienste nicht aufführt.
- **Eingebettete Karten oder Videos ohne Einwilligungsschranke** — Google Maps oder YouTube übermitteln schon beim Laden der Seite Daten.
- **Kein AVV mit Dienstleistern** — obwohl Hosting-Anbieter, E-Mail-Dienste oder Formularanbieter im Auftrag Daten verarbeiten.

Viele dieser Fehler sind mit überschaubarem Aufwand zu beheben — besonders dann, wenn man sie beim Aufbau einer neuen Website von Anfang an einplant.

---

## Barrierefreiheit und Datenschutz denken zusammen

Datenschutz ist nicht das einzige gesetzliche Thema, das Website-Betreiber im Blick haben sollten. Mit dem [BFSG und den Anforderungen an Barrierefreiheit](/blog/bfsg-barrierefreiheit-website) kommen auf viele Unternehmen weitere Pflichten zu — auch hier lohnt es sich, frühzeitig die richtigen Weichen zu stellen.

Wenn Sie gerade dabei sind, eine neue Website zu planen oder eine bestehende zu überarbeiten, finden Sie im Artikel zur [Auswahl der richtigen Webdesign-Agentur in München](/blog/webdesign-agentur-muenchen-auswahl) hilfreiche Kriterien, worauf es bei der Zusammenarbeit ankommt.

---

## Fazit

Eine DSGVO-konforme Website ist kein einmaliges Projekt, sondern ein fortlaufender Prozess. Gesetze ändern sich, Tools kommen und gehen, und was heute korrekt umgesetzt ist, muss in zwei Jahren möglicherweise angepasst werden.

Die gute Nachricht: Wer die Grundlagen einmal sauber aufgesetzt hat — lokale Schriftarten, funktionierendes Consent-Management, vollständige Datenschutzerklärung, Verschlüsselung — hat den größten Teil der Arbeit getan. Die meisten Anforderungen lassen sich mit dem richtigen technischen Aufbau von Anfang an erfüllen, ohne dass der Aufwand unverhältnismäßig wird.

Diese Checkliste gibt Ihnen eine Orientierung, ersetzt aber keine individuelle rechtliche Prüfung. Sprechen Sie im Zweifel mit einem Fachanwalt oder Datenschutzbeauftragten, der Ihre konkrete Situation kennt.

---

Wenn Sie Ihre Website neu aufsetzen oder datenschutzrechtlich überarbeiten möchten, sprechen Sie uns gerne an. Wir helfen Ihnen, die technischen Grundlagen von Anfang an sauber umzusetzen — ohne Schnellschüsse und ohne versteckte Kompromisse. [Unverbindliches Gespräch vereinbaren](/#kontakt)
