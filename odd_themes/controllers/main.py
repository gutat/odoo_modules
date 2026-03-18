# -*- coding: utf-8 -*-
import re
from odoo import http
from odoo.http import request


class OddThemesController(http.Controller):

    @http.route('/odd_themes/theme.css', type='http', auth='public', methods=['GET'], csrf=False)
    def theme_css(self, **kwargs):
        """Serve dynamic CSS that overrides the primary color."""
        icp = request.env['ir.config_parameter'].sudo()
        color = icp.get_param('odd_themes.primary_color', '#714B67')

        # Sanitize: only allow valid hex colors
        if not re.match(r'^#[0-9a-fA-F]{3,8}$', color):
            color = '#714B67'

        css = f"""
/* ================================================
   Odd Themes - Dynamic Primary Color Override
   Generated color: {color}
   ================================================ */

/* --- Bootstrap 5 Root Variables --- */
:root {{
    --bs-primary: {color} !important;
    --bs-primary-rgb: {_hex_to_rgb_str(color)} !important;
    --bs-link-color: {color} !important;
    --bs-link-hover-color: {color} !important;
}}

/* --- Odoo Root Variables --- */
:root {{
    --primary: {color} !important;
    --o-brand-primary: {color} !important;
    --o-brand-odoo: {color} !important;
}}

/* --- Navbar / Top Menu --- */
.o_main_navbar {{
    background: {color} !important;
    border-bottom-color: color-mix(in srgb, {color} 80%, black) !important;
    --NavBar-entry-backgroundColor: {color};
    --NavBar-entry-backgroundColor--hover: color-mix(in srgb, {color} 80%, black);
    --NavBar-entry-backgroundColor--focus: color-mix(in srgb, {color} 80%, black);
    --NavBar-entry-backgroundColor--active: color-mix(in srgb, {color} 70%, black);
}}

.o_main_navbar .o_menu_sections .o_nav_entry,
.o_main_navbar .o_menu_sections .dropdown-toggle {{
    background: {color} !important;
}}

.o_main_navbar .o_menu_sections .o_nav_entry:hover,
.o_main_navbar .o_menu_sections .dropdown-toggle:hover {{
    background: color-mix(in srgb, {color} 80%, black) !important;
}}

.o_main_navbar .o_menu_toggle {{
    color: white !important;
}}

.o_main_navbar .o_nav_entry,
.o_main_navbar .o-dropdown > .dropdown-toggle {{
    color: rgba(255, 255, 255, 0.85) !important;
}}

.o_main_navbar .o_nav_entry:hover,
.o_main_navbar .o_nav_entry:focus,
.o_main_navbar .o-dropdown > .dropdown-toggle:hover {{
    background-color: color-mix(in srgb, {color} 80%, black) !important;
    color: white !important;
}}

.o_main_navbar .o_menu_brand {{
    color: white !important;
}}

/* --- Primary Buttons --- */
.btn-primary {{
    --bs-btn-bg: {color} !important;
    --bs-btn-border-color: {color} !important;
    --bs-btn-hover-bg: color-mix(in srgb, {color} 85%, black) !important;
    --bs-btn-hover-border-color: color-mix(in srgb, {color} 75%, black) !important;
    --bs-btn-active-bg: color-mix(in srgb, {color} 75%, black) !important;
    --bs-btn-active-border-color: color-mix(in srgb, {color} 70%, black) !important;
    --bs-btn-disabled-bg: {color} !important;
    --bs-btn-disabled-border-color: {color} !important;
    background-color: {color} !important;
    border-color: {color} !important;
}}

.btn-primary:hover,
.btn-primary:focus,
.btn-primary:active {{
    background-color: color-mix(in srgb, {color} 85%, black) !important;
    border-color: color-mix(in srgb, {color} 75%, black) !important;
}}

/* --- Outline Primary Buttons --- */
.btn-outline-primary {{
    --bs-btn-color: {color} !important;
    --bs-btn-border-color: {color} !important;
    --bs-btn-hover-bg: {color} !important;
    --bs-btn-hover-border-color: {color} !important;
    --bs-btn-active-bg: {color} !important;
    --bs-btn-active-border-color: {color} !important;
    color: {color} !important;
    border-color: {color} !important;
}}

.btn-outline-primary:hover {{
    background-color: {color} !important;
    border-color: {color} !important;
    color: white !important;
}}

/* --- Links --- */
a:not(.btn) {{
    color: {color};
}}

a:not(.btn):hover {{
    color: color-mix(in srgb, {color} 80%, black);
}}

/* --- Text / Background / Border Utilities --- */
.text-primary {{
    color: {color} !important;
}}

.bg-primary {{
    background-color: {color} !important;
}}

.border-primary {{
    border-color: {color} !important;
}}

/* --- Form View Required Field Borders --- */
.o_field_widget .o_input.o_field_required {{
    border-color: {color} !important;
}}

/* --- Active Nav Pills / Tabs --- */
.nav-pills .nav-link.active,
.nav-pills .show > .nav-link {{
    background-color: {color} !important;
    border-color: {color} !important;
}}

/* --- Selection highlight --- */
.o_list_view .o_data_row.o_data_row_selected {{
    --ListRenderer-selection-bg: color-mix(in srgb, {color} 15%, white) !important;
}}

/* --- Checkbox / Radio --- */
.form-check-input:checked {{
    background-color: {color} !important;
    border-color: {color} !important;
}}

/* --- Input Focus --- */
.form-control:focus,
.form-select:focus {{
    border-color: {color} !important;
    box-shadow: 0 0 0 0.25rem color-mix(in srgb, {color} 25%, transparent) !important;
}}

/* --- Odoo Status Bar Arrow Buttons --- */
.o_statusbar_status .o_arrow_button.o_arrow_button_current:disabled {{
    border-color: {color} !important;
    color: {color} !important;
}}

.o_statusbar_status .o_arrow_button.o_arrow_button_current:disabled:after {{
    border-left-color: color-mix(in srgb, {color} 20%, #f8f9fa) !important;
}}

.o_statusbar_status .o_arrow_button.o_arrow_button_current:disabled:before,
.o_statusbar_status .o_arrow_button.o_arrow_button_current:disabled + .btn:before {{
    border-left-color: {color} !important;
}}

/* --- btn-secondary/btn-light active state (uses $o-brand-primary border) --- */
.btn-secondary:active,
.btn-secondary.active,
.btn-light:active,
.btn-light.active {{
    border-color: {color} !important;
}}

.btn-outline-secondary:active,
.btn-outline-secondary.active {{
    border-color: {color} !important;
}}

/* --- Required field border --- */
.o_field_widget .o_input[required],
.o_field_widget.o_required_modifier .o_input {{
    border-color: {color} !important;
}}

/* --- Badge Primary --- */
.badge.text-bg-primary {{
    background-color: {color} !important;
}}

/* --- Progress Bar --- */
.progress-bar {{
    background-color: {color} !important;
}}

/* --- Control Panel Button overrides from odd_themes.scss --- */
.o_control_panel .o_cp_action_menus > .o-dropdown > .dropdown-toggle,
.o_control_panel .o_form_button_save,
.o_control_panel .o_form_button_cancel {{
    border-color: {color} !important;
    color: {color} !important;
}}

.o_control_panel .o_cp_action_menus > .o-dropdown > .dropdown-toggle:hover,
.o_control_panel .o_form_button_save:hover,
.o_control_panel .o_form_button_cancel:hover {{
    background-color: {color} !important;
    color: white !important;
}}

/* --- Breadcrumb Title Color --- */
.o_last_breadcrumb_item {{
    color: {color} !important;
}}

/* --- Loading Indicator Bar --- */
.o_loading_indicator {{
    background-color: {color} !important;
}}

/* --- Stat Button Icons (Delivery, Invoices, etc.) --- */
.oe_stat_button .o_button_icon {{
    color: {color} !important;
    --o-stat-button-color: {color};
}}

.oe_stat_button .o_stat_value,
.oe_stat_button .o_pie_value {{
    color: {color} !important;
    --o-stat-text-color: {color};
}}

/* --- File Upload Progress --- */
.o_file_upload_progress_bar {{
    background-color: {color} !important;
}}

/* --- Kanban Record Color Indicator --- */
.o_kanban_header_title .o_column_title {{
    color: {color};
}}

/* --- Selection Highlight in Select2 --- */
.o_input .select2-search-choice {{
    background: {color} !important;
}}

/* --- Control Panel Searchbar Focus --- */
.o_cp_searchview .o_searchview:focus-within {{
    border-color: {color} !important;
    box-shadow: inset 0 0 0 1px {color} !important;
}}

.o_cp_searchview .o_searchview_dropdown_toggler:focus,
.o_cp_searchview .o_searchview_dropdown_toggler:active,
.o_cp_searchview .o_searchview_dropdown_toggler[aria-expanded="true"] {{
    border-color: {color} !important;
    color: {color} !important;
}}
"""
        return request.make_response(
            css,
            headers=[
                ('Content-Type', 'text/css'),
                ('Cache-Control', 'no-cache, no-store, must-revalidate'),
            ]
        )


def _hex_to_rgb_str(hex_color):
    """Convert #RRGGBB to 'R, G, B' string for CSS rgb() usage."""
    hex_color = hex_color.lstrip('#')
    if len(hex_color) == 3:
        hex_color = ''.join([c * 2 for c in hex_color])
    try:
        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)
        return f"{r}, {g}, {b}"
    except (ValueError, IndexError):
        return "113, 75, 103"
