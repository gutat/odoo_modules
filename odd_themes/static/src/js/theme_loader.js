/** @odoo-module **/

/**
 * Odd Themes - Dynamic CSS Loader
 * Injects the dynamic theme CSS served by /odd_themes/theme.css
 * This runs early so the color override is applied before painting.
 */
(function () {
    // Check if already injected
    if (document.getElementById('odd_themes_dynamic_css')) {
        return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '/odd_themes/theme.css?t=' + Date.now(); // cache-bust on each load
    link.id = 'odd_themes_dynamic_css';
    document.head.appendChild(link);
})();
