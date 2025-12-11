/**
 * kontakt-maps.js
 * Google Maps Consent-Integration für die Kontaktseite
 */

(function() {
    'use strict';

    // Google Maps aktivieren
    function enableGoogleMaps() {
        console.log('🔄 Versuche Google Maps zu aktivieren...');
        var placeholder = document.getElementById('maps-placeholder');
        var iframe = document.getElementById('google-maps-iframe');
        
        if (placeholder && iframe) {
            var mapSrc = iframe.getAttribute('data-src');
            
            // Fallback URL falls data-src nicht funktioniert
            if (!mapSrc) {
                mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2508.5!2d6.8897!3d51.0833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8c6a8a8a8a8a8%3A0x0!2sRheinpromenade%204a%2C%2040789%20Monheim%20am%20Rhein!5e0!3m2!1sde!2sde!4v1702300000000";
                console.log('🔄 Verwende Fallback URL');
            }
            
            if (mapSrc) {
                iframe.src = mapSrc;
                iframe.style.display = 'block';
                placeholder.style.display = 'none';
                iframe.setAttribute('data-consent-loaded', 'true');
                
                console.log('✅ Google Maps erfolgreich aktiviert!');
                return true;
            }
        }
        return false;
    }

    // Google Maps mit Cookie-Consent-System Integration
    function activateGoogleMapsWithConsent() {
        console.log('🍪 Google Maps über Cookie-System aktivieren...');
        
        if (window.ConsentManager && typeof window.ConsentManager.set === 'function') {
            try {
                window.ConsentManager.set({
                    necessary: true,
                    functional: true,
                    analytics: false,
                    marketing: false
                });
                
                console.log('✅ Funktionale Cookies über ConsentManager aktiviert');
                
                setTimeout(function() {
                    enableGoogleMaps();
                }, 200);
                
            } catch (error) {
                console.error('❌ Fehler beim Setzen der Cookie-Einstellungen:', error);
                fallbackMapActivation();
            }
        } else {
            console.warn('⚠️ ConsentManager nicht verfügbar, verwende Fallback');
            fallbackMapActivation();
        }
    }

    // Fallback für direkte Aktivierung ohne ConsentManager
    function fallbackMapActivation() {
        var userConfirm = confirm(
            "Funktionale Cookies aktivieren?\n\n" +
            "Für Google Maps werden funktionale Cookies benötigt.\n" +
            "Dabei werden Daten an Google übertragen.\n\n" +
            "Möchten Sie fortfahren?"
        );
        
        if (userConfirm) {
            console.log('✅ Nutzer hat Fallback-Consent erteilt');
            enableGoogleMaps();
        }
    }

    // Handler für Map Activation Button
    function handleMapActivation() {
        activateGoogleMapsWithConsent();
    }

    // Hilfsfunktion zum Verstecken der Maps (bei Cookie-Widerruf)
    function hideGoogleMaps() {
        var placeholder = document.getElementById('maps-placeholder');
        var iframe = document.getElementById('google-maps-iframe');
        
        if (placeholder && iframe) {
            iframe.style.display = 'none';
            iframe.src = '';
            placeholder.style.display = 'block';
            console.log('🚫 Google Maps versteckt (Cookie-Widerruf)');
        }
    }

    // Cookie-Consent Prüfung und Maps-Aktivierung
    function checkAndActivateMaps() {
        if (window.ConsentManager) {
            try {
                if (typeof window.ConsentManager.has === 'function') {
                    var hasFunctional = window.ConsentManager.has('functional');
                    
                    if (hasFunctional) {
                        console.log('✅ Funktionale Cookies bereits aktiv, lade Maps...');
                        enableGoogleMaps();
                    }
                }
                
                if (typeof window.ConsentManager.onChange === 'function') {
                    window.ConsentManager.onChange(function(preferences) {
                        if (preferences && preferences.functional) {
                            enableGoogleMaps();
                        } else {
                            hideGoogleMaps();
                        }
                    });
                }
                
            } catch (error) {
                console.warn('⚠️ Fehler bei Cookie-Prüfung:', error);
            }
        }
    }

    // Initialisierung beim Laden
    function init() {
        console.log('🚀 Kontaktseite geladen, initialisiere Maps-Integration...');
        
        var attempts = 0;
        var maxAttempts = 10;
        
        function tryInitialize() {
            attempts++;
            
            if (window.ConsentManager) {
                checkAndActivateMaps();
            } else if (attempts < maxAttempts) {
                setTimeout(tryInitialize, 500);
            }
        }
        
        tryInitialize();
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Globale API für HTML onclick
    window.enableGoogleMaps = enableGoogleMaps;
    window.activateGoogleMapsWithConsent = activateGoogleMapsWithConsent;
    window.handleMapActivation = handleMapActivation;

})();
