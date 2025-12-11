/**
 * shared-init.js
 * Gemeinsame Initialisierungs-Scripts für alle Seiten
 * Zentralisiert: AOS, Mobile Dropdowns, Cookie-Consent Integration
 */

(function() {
    'use strict';

    // ===========================================
    // AOS (Animate on Scroll) Initialisierung
    // ===========================================
    function initAOS(options) {
        const defaultOptions = {
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 50
        };
        
        const config = Object.assign({}, defaultOptions, options || {});
        
        if (window.AOS && typeof AOS.init === 'function') {
            AOS.init(config);
        }
    }

    // AOS mit Cookie-Consent Integration
    function initAOSWithConsent() {
        // Warte auf Consent Manager
        setTimeout(function() {
            if (window.ConsentManager) {
                // Bei Änderung der Einstellungen
                if (typeof window.ConsentManager.onChange === 'function') {
                    window.ConsentManager.onChange(function(prefs) {
                        if (prefs && prefs.functional) {
                            setTimeout(function() { initAOS(); }, 100);
                        }
                    });
                }
                
                // Prüfe aktuelle Einstellungen
                try {
                    if (typeof window.ConsentManager.getPreferences === 'function') {
                        var preferences = window.ConsentManager.getPreferences();
                        if (preferences && preferences.functional) {
                            initAOS();
                            return;
                        }
                    }
                    // Fallback: has() Methode
                    if (typeof window.ConsentManager.has === 'function' && window.ConsentManager.has('functional')) {
                        initAOS();
                        return;
                    }
                } catch (error) {
                    console.warn('ConsentManager Fehler, verwende Standard AOS');
                }
            }
            
            // Fallback: AOS normal initialisieren
            initAOS();
        }, 500);
    }

    // ===========================================
    // Mobile Dropdown Funktionalität
    // ===========================================
    function initMobileDropdowns() {
        var mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
        
        mobileDropdownToggles.forEach(function(toggle) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                var dropdown = this.closest('.mobile-dropdown');
                if (!dropdown) return;
                
                var content = dropdown.querySelector('.mobile-dropdown-content');
                if (!content) return;
                
                // Toggle the dropdown
                if (content.classList.contains('hidden')) {
                    content.classList.remove('hidden');
                    dropdown.classList.add('active');
                } else {
                    content.classList.add('hidden');
                    dropdown.classList.remove('active');
                }
            });
        });
    }

    // ===========================================
    // Scroll Progress Bar
    // ===========================================
    function initScrollProgress() {
        var scrollTimeout;
        
        window.addEventListener('scroll', function() {
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(function() {
                var scrollProgress = document.getElementById('scroll-progress');
                if (scrollProgress) {
                    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    var scrollPercent = (scrollTop / scrollHeight) * 100;
                    
                    requestAnimationFrame(function() {
                        scrollProgress.style.transform = 'scaleX(' + (scrollPercent / 100) + ')';
                    });
                }
                scrollTimeout = null;
            }, 10);
        }, { passive: true });
    }

    // ===========================================
    // Cursor Follower (Optional)
    // ===========================================
    function initCursorFollower() {
        var cursor = document.getElementById('cursor-follower');
        if (!cursor) return;
        
        document.addEventListener('mousemove', function(e) {
            setTimeout(function() {
                cursor.style.opacity = '1';
                cursor.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px) translate(-50%, -50%)';
            }, 100);
        });
        
        document.addEventListener('mouseleave', function() {
            cursor.style.opacity = '0';
        });
    }

    // ===========================================
    // Preloader
    // ===========================================
    function initPreloader() {
        window.addEventListener('load', function() {
            setTimeout(function() {
                var preloader = document.getElementById('preloader');
                if (preloader) {
                    preloader.classList.replace('loading', 'loaded');
                }
            }, 1500);
        });
    }

    // ===========================================
    // Hero Video Sound Toggle
    // ===========================================
    function initVideoSoundToggle() {
        var soundToggle = document.getElementById('soundToggle');
        var soundIcon = document.getElementById('soundIcon');
        var heroVideo = document.getElementById('heroVideo');
        
        if (!soundToggle || !soundIcon || !heroVideo) return;
        
        // Video startet stumm
        heroVideo.muted = true;
        heroVideo.volume = 0.7;
        
        // Entferne alte Event-Listener
        var newSoundToggle = soundToggle.cloneNode(true);
        soundToggle.parentNode.replaceChild(newSoundToggle, soundToggle);
        
        var newSoundIcon = newSoundToggle.querySelector('#soundIcon') || newSoundToggle.querySelector('i');
        
        newSoundToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            heroVideo.muted = !heroVideo.muted;
            
            if (heroVideo.muted) {
                if (newSoundIcon) {
                    newSoundIcon.classList.remove('fa-volume-up');
                    newSoundIcon.classList.add('fa-volume-mute');
                }
            } else {
                if (newSoundIcon) {
                    newSoundIcon.classList.remove('fa-volume-mute');
                    newSoundIcon.classList.add('fa-volume-up');
                }
                if (heroVideo.paused) {
                    heroVideo.play().catch(function(e) { console.log('Play failed:', e); });
                }
            }
        });
    }

    // ===========================================
    // Hero Video Loading
    // ===========================================
    function initVideoLoading() {
        var heroVideo = document.getElementById('heroVideo');
        var videoLoader = document.getElementById('videoLoader');
        
        if (!heroVideo || !videoLoader) return;
        
        heroVideo.addEventListener('canplay', function() {
            heroVideo.style.opacity = '1';
            videoLoader.style.display = 'none';
        });
        
        // Fallback nach 3 Sekunden
        setTimeout(function() {
            if (videoLoader.style.display !== 'none') {
                heroVideo.style.opacity = '1';
                videoLoader.style.display = 'none';
            }
        }, 3000);
        
        heroVideo.load();
    }

    // ===========================================
    // Dynamic Hero Height
    // ===========================================
    function setHeroHeight() {
        try {
            var header = document.querySelector('header');
            var hero = document.getElementById('heroSection');
            var vh = window.innerHeight;
            var headerH = header ? header.offsetHeight : 0;
            var heroH = Math.max(0, vh - headerH);
            
            document.documentElement.style.setProperty('--header-h', headerH + 'px');
            document.documentElement.style.setProperty('--hero-h', heroH + 'px');
        } catch (e) {
            // Fallback ignorieren
        }
    }

    function initHeroHeight() {
        var heroSection = document.getElementById('heroSection');
        if (!heroSection) return;
        
        setHeroHeight();
        window.addEventListener('resize', setHeroHeight);
        window.addEventListener('orientationchange', setHeroHeight);
    }

    // ===========================================
    // FAQ Toggle (für index.html)
    // ===========================================
    function initFAQ() {
        // FAQ Tab functionality
        var faqTabs = document.querySelectorAll('.faq-tab');
        var faqTabContents = document.querySelectorAll('.faq-tab-content');
        
        if (faqTabs.length === 0) return;
        
        faqTabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                var targetTab = this.getAttribute('data-tab');
                
                faqTabs.forEach(function(t) { t.classList.remove('active'); });
                faqTabContents.forEach(function(content) {
                    content.classList.remove('active');
                    content.classList.add('hidden');
                });
                
                this.classList.add('active');
                var targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                    targetContent.classList.remove('hidden');
                }
            });
        });
        
        // FAQ Question functionality
        var faqButtons = document.querySelectorAll('.faq-question');
        
        faqButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var faqId = this.getAttribute('data-faq');
                var answer = document.getElementById('answer-' + faqId);
                var icon = document.getElementById('icon-' + faqId);
                
                // Close all other FAQ items in the current tab
                var currentTab = this.closest('.faq-tab-content');
                if (currentTab) {
                    var currentTabButtons = currentTab.querySelectorAll('.faq-question');
                    
                    currentTabButtons.forEach(function(otherButton) {
                        if (otherButton !== button) {
                            var otherId = otherButton.getAttribute('data-faq');
                            var otherAnswer = document.getElementById('answer-' + otherId);
                            var otherIcon = document.getElementById('icon-' + otherId);
                            
                            if (otherAnswer) otherAnswer.classList.add('hidden');
                            if (otherIcon) otherIcon.classList.remove('rotate-180');
                        }
                    });
                }
                
                // Toggle current FAQ item
                if (answer && icon) {
                    if (answer.classList.contains('hidden')) {
                        answer.classList.remove('hidden');
                        icon.classList.add('rotate-180');
                    } else {
                        answer.classList.add('hidden');
                        icon.classList.remove('rotate-180');
                    }
                }
            });
        });
    }

    // ===========================================
    // Hauptinitialisierung
    // ===========================================
    function init() {
        // Basis-Funktionen
        initMobileDropdowns();
        initScrollProgress();
        initPreloader();
        
        // AOS mit Consent
        initAOSWithConsent();
        
        // Optionale Funktionen (nur wenn Elemente vorhanden)
        initCursorFollower();
        initHeroHeight();
        initVideoLoading();
        initVideoSoundToggle();
        initFAQ();
    }

    // Start bei DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Globale API für spezielle Seiten
    window.SharedInit = {
        initAOS: initAOS,
        initAOSWithConsent: initAOSWithConsent,
        initMobileDropdowns: initMobileDropdowns,
        initScrollProgress: initScrollProgress,
        initFAQ: initFAQ,
        setHeroHeight: setHeroHeight
    };

})();
