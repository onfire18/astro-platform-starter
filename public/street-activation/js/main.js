/* ============================================================
   STREET ACTIVATION — JavaScript
   HIER PFLEGT PAUL ALLE ZENTRALEN WERTE (ganz oben).
   ============================================================ */

/* ---------- 1) ZENTRALE EINSTELLUNGEN (nur hier ändern!) ---------- */

// Buchungs-Link (z. B. Calendly). Solange leer: Buttons springen zum CTA-Bereich.
// Beispiel: const BUCHUNGS_LINK = "https://calendly.com/dein-name/erstgespraech";
const BUCHUNGS_LINK = ""; // [PLATZHALTER: Buchungs-Link]

// Markenname: "Street Activation" (Standard) oder z. B. "Attention Marketing".
// Wird automatisch überall eingesetzt, wo data-markenname im HTML steht.
const MARKEN_NAME = "Street Activation";

// Zahlen für Sektion 8. null = noch kein Wert -> es bleibt "XX" stehen.
// Sobald eine Zahl eingetragen ist, zählt sie beim Scrollen von 0 hoch.
const ZAHLEN = {
    views: null,        // [PLATZHALTER: XX] Mio. Views (nur die Zahl, z. B. 12)
    impressionen: null, // [PLATZHALTER: XX] Mio. Impressionen
    teilnehmer: null,   // [PLATZHALTER: XX] Teilnehmer (z. B. 500)
    unternehmen: null,  // [PLATZHALTER: XX] Unternehmen
    kommentare: null    // [PLATZHALTER: XX] Kommentare (z. B. 25000)
};

/* ---------- 2) Reduzierte Bewegung erkennen ---------- */
// Wenn jemand im System "weniger Bewegung" eingestellt hat, schalten wir Animationen ab.
const reduzierteBewegung = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 3) Markenname überall einsetzen ---------- */
document.querySelectorAll('[data-markenname]').forEach(function (el) {
    el.textContent = MARKEN_NAME;
});

/* ---------- 4) Buchungs-Buttons zentral verlinken ---------- */
document.querySelectorAll('.js-buchung').forEach(function (knopf) {
    if (BUCHUNGS_LINK) {
        knopf.setAttribute('href', BUCHUNGS_LINK);
        knopf.setAttribute('target', '_blank');
        knopf.setAttribute('rel', 'noopener'); // Sicherheit bei target=_blank
    } else {
        // Ohne Link: sanft zum CTA-Bereich scrollen
        knopf.setAttribute('href', '#cta');
    }
});

// Hinweis unter dem CTA-Button ausblenden, sobald der Link gepflegt ist
const buchungHinweis = document.querySelector('[data-buchung-hinweis]');
if (buchungHinweis && BUCHUNGS_LINK) {
    buchungHinweis.hidden = true;
}

/* ---------- 5) Scroll-Reveal per IntersectionObserver ---------- */
const revealElemente = document.querySelectorAll('.reveal');

if (reduzierteBewegung || !('IntersectionObserver' in window)) {
    // Keine Animation: alles sofort sichtbar machen
    revealElemente.forEach(function (el) { el.classList.add('sichtbar'); });
} else {
    const revealBeobachter = new IntersectionObserver(function (eintraege) {
        eintraege.forEach(function (eintrag) {
            if (eintrag.isIntersecting) {
                eintrag.target.classList.add('sichtbar');
                revealBeobachter.unobserve(eintrag.target); // nur einmal animieren
            }
        });
    }, { threshold: 0.15 });

    revealElemente.forEach(function (el, index) {
        // Leichte Staffelung, damit z. B. die Ablauf-Kette nacheinander erscheint
        el.style.transitionDelay = (index % 8) * 0.06 + 's';
        revealBeobachter.observe(el);
    });
}

/* ---------- 6) Zahlen: Zähl-Animation beim Erscheinen ---------- */
function zahlFormatieren(wert) {
    // Deutsche Formatierung: 25000 -> 25.000
    return wert.toLocaleString('de-DE');
}

function zahlHochzaehlen(element, zielwert) {
    if (reduzierteBewegung) {
        element.textContent = zahlFormatieren(zielwert);
        return;
    }
    const dauer = 1500; // Millisekunden
    const start = performance.now();

    function schritt(jetzt) {
        const fortschritt = Math.min((jetzt - start) / dauer, 1);
        // Leichtes Abbremsen am Ende (ease-out)
        const eased = 1 - Math.pow(1 - fortschritt, 3);
        element.textContent = zahlFormatieren(Math.round(zielwert * eased));
        if (fortschritt < 1) requestAnimationFrame(schritt);
    }
    requestAnimationFrame(schritt);
}

document.querySelectorAll('.zahl').forEach(function (element) {
    const schluessel = element.dataset.zahl;
    const zielwert = ZAHLEN[schluessel];

    if (zielwert === null || zielwert === undefined) {
        element.textContent = 'XX'; // Platzhalter, bis Paul die Zahl einträgt
        return;
    }

    if ('IntersectionObserver' in window) {
        const beobachter = new IntersectionObserver(function (eintraege) {
            eintraege.forEach(function (eintrag) {
                if (eintrag.isIntersecting) {
                    zahlHochzaehlen(element, zielwert);
                    beobachter.unobserve(element);
                }
            });
        }, { threshold: 0.5 });
        beobachter.observe(element);
    } else {
        element.textContent = zahlFormatieren(zielwert);
    }
});

/* ---------- 7) Vorstellungsvideo: klick-to-play mit Ton ---------- */
document.querySelectorAll('.js-content-video').forEach(function (rahmen) {
    const video = rahmen.querySelector('video');
    const playKnopf = rahmen.querySelector('.video-play');
    if (!video || !playKnopf) return;

    playKnopf.addEventListener('click', function () {
        video.setAttribute('controls', '');
        const abspielen = video.play();
        if (abspielen && abspielen.catch) {
            abspielen.catch(function () {
                // Datei fehlt noch: Hinweis im Overlay anzeigen statt kaputtem Player
                playKnopf.querySelector('.video-play-text').textContent =
                    'Video folgt — Datei in assets/videos/vorstellung.mp4 ablegen';
                video.removeAttribute('controls');
                return;
            });
        }
        // Overlay ausblenden, sobald das Video wirklich läuft
        video.addEventListener('playing', function () {
            playKnopf.hidden = true;
        }, { once: true });
    });
});

/* ---------- 8) Hero-Reel: Platzhalter-Hinweis ausblenden, wenn Video da ist ---------- */
const heroVideo = document.querySelector('.hero-video');
const heroHinweis = document.querySelector('[data-platzhalter-hero]');
if (heroVideo && heroHinweis) {
    heroVideo.addEventListener('loadeddata', function () {
        heroHinweis.hidden = true; // Video lädt -> Hinweis weg
    });
}

/* ---------- 9) Beispiel-Kacheln + Lightbox ---------- */
const modal = document.getElementById('video-modal');
const modalHalter = modal ? modal.querySelector('.modal-video-halter') : null;
let letzterFokus = null; // merkt sich, welcher Knopf die Lightbox geöffnet hat

function modalOeffnen(inhaltHtml) {
    if (!modal || !modalHalter) return;
    letzterFokus = document.activeElement;
    modalHalter.innerHTML = inhaltHtml;
    modal.hidden = false;
    document.body.style.overflow = 'hidden'; // Seite hinter der Lightbox nicht scrollen
    modal.querySelector('.modal-schliessen').focus();
}

function modalSchliessen() {
    if (!modal || !modalHalter) return;
    modalHalter.innerHTML = ''; // Video stoppen, indem es entfernt wird
    modal.hidden = true;
    document.body.style.overflow = '';
    if (letzterFokus) letzterFokus.focus();
}

if (modal) {
    modal.querySelectorAll('.js-modal-schliessen').forEach(function (el) {
        el.addEventListener('click', modalSchliessen);
    });
    document.addEventListener('keydown', function (ereignis) {
        if (ereignis.key === 'Escape' && !modal.hidden) modalSchliessen();
    });
}

document.querySelectorAll('.js-beispiel').forEach(function (kachel) {
    const videoPfad = kachel.dataset.video;
    const posterPfad = kachel.dataset.poster;
    const titel = kachel.dataset.titel;

    // Prüfen, ob die Videodatei schon existiert (Kachel schaltet sich automatisch scharf)
    const testVideo = document.createElement('video');
    testVideo.preload = 'metadata';
    testVideo.src = videoPfad;
    testVideo.addEventListener('loadedmetadata', function () {
        kachel.classList.add('hat-video');
        kachel.querySelector('.beispiel-status').textContent = '▶ Ansehen';
        if (posterPfad) {
            // Poster als Kachel-Hintergrund, falls vorhanden
            const testBild = new Image();
            testBild.onload = function () {
                kachel.style.backgroundImage =
                    'linear-gradient(rgba(11,11,15,0.45), rgba(11,11,15,0.7)), url("' + posterPfad + '")';
            };
            testBild.src = posterPfad;
        }
    });

    kachel.addEventListener('click', function () {
        if (kachel.classList.contains('hat-video')) {
            // Video in der Lightbox abspielen (mit Ton, mit Bedienelementen)
            modalOeffnen(
                '<video controls autoplay playsinline preload="metadata"' +
                (posterPfad ? ' poster="' + posterPfad + '"' : '') +
                ' title="Beispielvideo ' + titel + '">' +
                '<source src="' + videoPfad + '" type="video/mp4">' +
                '</video>'
            );
        } else {
            // Noch kein Video: freundlicher Hinweis statt kaputtem Player
            modalOeffnen(
                '<div class="modal-platzhalter"><strong>' + titel + '</strong><br><br>' +
                'Video folgt.<br><small>[PLATZHALTER: Datei unter ' + videoPfad + ' ablegen]</small></div>'
            );
        }
    });
});
