# -*- coding: utf-8 -*-
{
    'name': 'Odd Themes',
    'version': '17.0.1.0.0',
    'category': 'Web',
    'summary': 'Customizable UI theme with configurable primary color',
    'description': 'Advanced theming module with a settings page to change the primary color across the entire Odoo backend.',
    'author': "My Company",
    'website': "https://www.yourcompany.com",
    'depends': ['web', 'base_setup'],
    'data': [
        'views/res_config_settings_views.xml',
        'views/menu_dashboard.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'odd_themes/static/src/scss/login.scss',
        ],
        'web.assets_backend': [
            'odd_themes/static/src/scss/odd_themes.scss',
            'odd_themes/static/src/scss/home_dashboard.scss',
            'odd_themes/static/src/xml/control_panel.xml',
            'odd_themes/static/src/js/theme_loader.js',
            'odd_themes/static/src/js/navbar_patch.js',
            'odd_themes/static/src/js/title_patch.js',
            'odd_themes/static/src/js/button_box_patch.js',
            'odd_themes/static/src/js/dashboard_view.js',
            'odd_themes/static/src/xml/dashboard_view.xml',
        ],
    },
    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}
