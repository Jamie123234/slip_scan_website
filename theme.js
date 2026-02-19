/**
 * Theme Manager - System Theme Detection & Toggle
 * Handles dark/light mode across all pages
 */

(function () {
    'use strict';

    // Detect system theme preference
    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Get stored theme preference or default to system
    function getStoredTheme() {
        const stored = localStorage.getItem('theme');
        if (stored) {
            return stored;
        }
        return getSystemTheme();
    }

    // Apply theme to document
    function applyTheme(theme) {
        const root = document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark-theme');
            root.classList.remove('light-theme');
            root.setAttribute('data-theme', 'dark');
        } else {
            root.classList.add('light-theme');
            root.classList.remove('dark-theme');
            root.setAttribute('data-theme', 'light');
        }

        // Update any theme toggle buttons
        updateThemeToggleButtons(theme);
    }

    // Update all theme toggle buttons on the page
    function updateThemeToggleButtons(theme) {
        const themeToggles = document.querySelectorAll('[data-theme-toggle]');
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
    }

    // Toggle theme
    function toggleTheme() {
        const currentTheme = getStoredTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    }

    // Initialize theme immediately (before page load to prevent flash)
    const initialTheme = getStoredTheme();
    applyTheme(initialTheme);

    // Initialize theme toggles when DOM is ready
    function initializeThemeToggles() {
        const themeToggles = document.querySelectorAll('[data-theme-toggle]');

        themeToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                toggleTheme();
            });
        });

        // Update button states
        updateThemeToggleButtons(initialTheme);
    }

    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                applyTheme(newTheme);
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeThemeToggles);
    } else {
        initializeThemeToggles();
    }

    // Expose API for manual theme setting
    window.SlipScanTheme = {
        get: getStoredTheme,
        set: function (theme) {
            if (theme === 'dark' || theme === 'light') {
                localStorage.setItem('theme', theme);
                applyTheme(theme);
            }
        },
        toggle: toggleTheme,
        getSystem: getSystemTheme
    };
})();
