/*
  Cookie-Beschränkungs-System für Elat Website
  
  Dieses Script nutzt den bereits vorhandenen ConsentManager,
  um Inhalte basierend auf Cookie-Einstellungen zu beschränken.
  
  Verwendung:
  1. Fügen Sie data-consent-required="category" zu Elementen hinzu
  2. Inkludieren Sie dieses Script nach dem consent-manager.js
  3. Das System beschränkt automatisch Inhalte ohne entsprechende Cookies
*/

(function() {
  'use strict';

  // Konfiguration
  const CONFIG = {
    blurClass: 'consent-restricted',
    overlayClass: 'consent-overlay-message',
    hiddenClass: 'consent-hidden',
    restrictedAttribute: 'data-consent-required',
    // Verschiedene Beschränkungstypen
    restrictionTypes: {
      'blur': 'consent-restricted',      // Unscharf machen
      'hide': 'consent-hidden',          // Komplett verstecken
      'disable': 'consent-disabled'      // Deaktivieren aber sichtbar
    }
  };

  // CSS für Beschränkungen hinzufügen
  function addRestrictionStyles() {
    if (document.getElementById('consent-restriction-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'consent-restriction-styles';
    style.textContent = `
      .consent-restricted {
        filter: blur(3px);
        pointer-events: none;
        position: relative;
        -webkit-user-select: none; /* Safari support */
        user-select: none;
        transition: filter 0.3s ease;
      }
      
      .consent-hidden {
        display: none !important;
      }
      
      .consent-disabled {
        opacity: 0.5;
        pointer-events: none;
        cursor: not-allowed;
      }
      
      .consent-overlay-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(17, 24, 39, 0.95);
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        text-align: center;
        z-index: 1000;
        filter: none;
        pointer-events: auto;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        max-width: 300px;
        -webkit-backdrop-filter: blur(10px); /* Safari support */
        backdrop-filter: blur(10px);
      }
      
      .consent-overlay-message h4 {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
      }
      
      .consent-overlay-message p {
        margin: 0 0 12px 0;
        font-size: 14px;
        line-height: 1.4;
        opacity: 0.9;
      }
      
      .consent-overlay-message button {
        background: #B83232;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.2s;
      }
      
      .consent-overlay-message button:hover {
        background: #a02828;
      }
      
      /* Animationen */
      @keyframes fadeInScale {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
      
      .consent-overlay-message {
        animation: fadeInScale 0.3s ease-out;
      }
      
      /* Responsive */
      @media (max-width: 640px) {
        .consent-overlay-message {
          max-width: 250px;
          padding: 12px 16px;
        }
        
        .consent-overlay-message h4 {
          font-size: 14px;
        }
        
        .consent-overlay-message p {
          font-size: 13px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Kategorie-Namen auf Deutsch
  function getCategoryDisplayName(category) {
    const names = {
      'analytics': 'Analyse',
      'marketing': 'Marketing',
      'functional': 'Funktionale',
      'advertising': 'Werbe',
      'social': 'Social Media'
    };
    return names[category] || category;
  }

  // Overlay-Nachricht erstellen
  function createOverlayMessage(category, element) {
    const overlay = document.createElement('div');
    overlay.className = CONFIG.overlayClass;
    
    const categoryName = getCategoryDisplayName(category);
    
    overlay.innerHTML = `
      <h4>🍪 Cookies erforderlich</h4>
      <p>Für diesen Inhalt benötigen Sie ${categoryName}-Cookies.</p>
      <button onclick="window.ConsentManager?.open()" aria-label="Cookie-Einstellungen öffnen">
        Einstellungen öffnen
      </button>
    `;
    
    return overlay;
  }

  // Element beschränken
  function restrictElement(element, category, restrictionType = 'blur') {
    const className = CONFIG.restrictionTypes[restrictionType] || CONFIG.restrictionTypes['blur'];
    
    element.classList.add(className);
    
    // Overlay nur bei blur-Typ hinzufügen
    if (restrictionType === 'blur' && !element.querySelector('.' + CONFIG.overlayClass)) {
      const overlay = createOverlayMessage(category, element);
      
      // Sicherstellen dass Element relative Positionierung hat
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.position === 'static') {
        element.style.position = 'relative';
      }
      
      element.appendChild(overlay);
    }
    
    // Attribute für Debugging setzen
    element.setAttribute('data-consent-status', 'restricted');
    element.setAttribute('data-consent-reason', `${category}-cookies-required`);
  }

  // Element freigeben
  function unrestrictElement(element) {
    // Alle Beschränkungsklassen entfernen
    Object.values(CONFIG.restrictionTypes).forEach(className => {
      element.classList.remove(className);
    });
    
    // Overlay entfernen
    const overlay = element.querySelector('.' + CONFIG.overlayClass);
    if (overlay) {
      overlay.remove();
    }
    
    // Debugging-Attribute aktualisieren
    element.setAttribute('data-consent-status', 'allowed');
    element.removeAttribute('data-consent-reason');
  }

  // Alle Elemente mit Cookie-Anforderungen verarbeiten
  function updateConsentRestrictions() {
    if (!window.ConsentManager) {
      console.warn('ConsentManager nicht verfügbar');
      return;
    }

    // Alle Elemente mit data-consent-required finden
    const elements = document.querySelectorAll(`[${CONFIG.restrictedAttribute}]`);
    
    elements.forEach(element => {
      const requiredCategory = element.getAttribute(CONFIG.restrictedAttribute);
      const restrictionType = element.getAttribute('data-restriction-type') || 'blur';
      const hasConsent = window.ConsentManager.has(requiredCategory);
      
      if (hasConsent) {
        unrestrictElement(element);
      } else {
        restrictElement(element, requiredCategory, restrictionType);
      }
    });
    
    // Custom Event für andere Scripts
    document.dispatchEvent(new CustomEvent('consentRestrictionsUpdated', {
      detail: {
        restrictedElements: document.querySelectorAll('.consent-restricted, .consent-hidden, .consent-disabled').length,
        allowedElements: elements.length - document.querySelectorAll('.consent-restricted, .consent-hidden, .consent-disabled').length
      }
    }));
  }

  // Formulare beschränken
  function restrictForms() {
    if (!window.ConsentManager) return;

    document.querySelectorAll('form[data-consent-required]').forEach(form => {
      const requiredCategory = form.getAttribute('data-consent-required');
      const hasConsent = window.ConsentManager.has(requiredCategory);
      
      if (!hasConsent) {
        // Alle Eingabefelder deaktivieren
        form.querySelectorAll('input, textarea, select, button').forEach(field => {
          field.disabled = true;
          field.setAttribute('data-consent-disabled', 'true');
        });
        
        // Hinweis hinzufügen
        if (!form.querySelector('.consent-form-notice')) {
          const notice = document.createElement('div');
          notice.className = 'consent-form-notice';
          notice.style.cssText = `
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 16px;
            font-size: 14px;
          `;
          notice.innerHTML = `
            <strong>🍪 Cookies erforderlich:</strong> 
            Dieses Formular benötigt ${getCategoryDisplayName(requiredCategory)}-Cookies.
            <button type="button" onclick="window.ConsentManager?.open()" 
                    style="background:#B83232;color:white;border:none;padding:4px 8px;border-radius:3px;margin-left:8px;cursor:pointer;">
              Einstellungen
            </button>
          `;
          form.insertBefore(notice, form.firstChild);
        }
      } else {
        // Felder wieder aktivieren
        form.querySelectorAll('[data-consent-disabled]').forEach(field => {
          field.disabled = false;
          field.removeAttribute('data-consent-disabled');
        });
        
        // Hinweis entfernen
        const notice = form.querySelector('.consent-form-notice');
        if (notice) notice.remove();
      }
    });
  }

  // Links beschränken
  function restrictLinks() {
    if (!window.ConsentManager) return;

    document.querySelectorAll('a[data-consent-required]').forEach(link => {
      const requiredCategory = link.getAttribute('data-consent-required');
      const hasConsent = window.ConsentManager.has(requiredCategory);
      
      if (!hasConsent) {
        // Original href speichern
        if (!link.getAttribute('data-original-href')) {
          link.setAttribute('data-original-href', link.href);
        }
        
        link.href = '#';
        link.onclick = function(e) {
          e.preventDefault();
          alert(`Für diesen Link benötigen Sie ${getCategoryDisplayName(requiredCategory)}-Cookies.`);
          if (confirm('Möchten Sie die Cookie-Einstellungen öffnen?')) {
            window.ConsentManager?.open();
          }
        };
        
        link.style.opacity = '0.6';
        link.title = `Benötigt ${getCategoryDisplayName(requiredCategory)}-Cookies`;
      } else {
        // Original href wiederherstellen
        const originalHref = link.getAttribute('data-original-href');
        if (originalHref) {
          link.href = originalHref;
          link.onclick = null;
          link.style.opacity = '';
          link.title = '';
        }
      }
    });
  }

  // Videos und Embeds beschränken
  function restrictEmbeds() {
    if (!window.ConsentManager) return;

    document.querySelectorAll('iframe[data-consent-required], video[data-consent-required]').forEach(embed => {
      const requiredCategory = embed.getAttribute('data-consent-required');
      const hasConsent = window.ConsentManager.has(requiredCategory);
      
      if (!hasConsent) {
        // Original src speichern
        if (!embed.getAttribute('data-original-src')) {
          embed.setAttribute('data-original-src', embed.src);
        }
        
        // Placeholder erstellen
        if (!embed.nextElementSibling?.classList.contains('consent-embed-placeholder')) {
          const placeholder = document.createElement('div');
          placeholder.className = 'consent-embed-placeholder';
          placeholder.style.cssText = `
            width: ${embed.offsetWidth || 560}px;
            height: ${embed.offsetHeight || 315}px;
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #6c757d;
            border-radius: 8px;
          `;
          placeholder.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 16px;">🍪</div>
            <h4 style="margin: 0 0 8px 0;">Cookies erforderlich</h4>
            <p style="margin: 0 0 16px 0;">Für diesen Inhalt benötigen Sie ${getCategoryDisplayName(requiredCategory)}-Cookies.</p>
            <button onclick="window.ConsentManager?.open()" 
                    style="background:#B83232;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;">
              Cookies aktivieren
            </button>
          `;
          
          embed.style.display = 'none';
          embed.parentNode.insertBefore(placeholder, embed.nextSibling);
        }
      } else {
        // Original src wiederherstellen
        const originalSrc = embed.getAttribute('data-original-src');
        if (originalSrc && embed.src !== originalSrc) {
          embed.src = originalSrc;
        }
        
        embed.style.display = '';
        
        // Placeholder entfernen
        const placeholder = embed.nextElementSibling;
        if (placeholder?.classList.contains('consent-embed-placeholder')) {
          placeholder.remove();
        }
      }
    });
  }

  // Hauptfunktion - alle Beschränkungen aktualisieren
  function updateAllRestrictions() {
    updateConsentRestrictions();
    restrictForms();
    restrictLinks();
    restrictEmbeds();
  }

  // Event Listener für Clicks auf beschränkte Elemente
  function setupClickPrevention() {
    document.addEventListener('click', function(e) {
      const restrictedElement = e.target.closest('.consent-restricted, .consent-disabled');
      if (restrictedElement && !e.target.closest('.' + CONFIG.overlayClass)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  // Öffentliche API
  window.ConsentRestrictions = {
    update: updateAllRestrictions,
    restrict: restrictElement,
    unrestrict: unrestrictElement,
    updateContent: updateConsentRestrictions,
    updateForms: restrictForms,
    updateLinks: restrictLinks,
    updateEmbeds: restrictEmbeds
  };

  // Initialisierung
  function init() {
    addRestrictionStyles();
    setupClickPrevention();
    
    // Erste Aktualisierung
    setTimeout(updateAllRestrictions, 100);
    
    // ConsentManager Integration
    if (window.ConsentManager) {
      window.ConsentManager.onChange(updateAllRestrictions);
    } else {
      // Warten bis ConsentManager verfügbar ist
      let attempts = 0;
      const checkManager = setInterval(() => {
        attempts++;
        if (window.ConsentManager) {
          clearInterval(checkManager);
          window.ConsentManager.onChange(updateAllRestrictions);
          updateAllRestrictions();
        } else if (attempts > 50) { // 5 Sekunden timeout
          clearInterval(checkManager);
          console.warn('ConsentManager nicht gefunden - Beschränkungen funktionieren nicht');
        }
      }, 100);
    }
    
    // Bei DOM-Änderungen neu prüfen
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && node.querySelector?.(`[${CONFIG.restrictedAttribute}]`)) {
            shouldUpdate = true;
          }
        });
      });
      if (shouldUpdate) {
        setTimeout(updateAllRestrictions, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
