# -*- coding: utf-8 -*-
{
    'name': "Odd Tauri",
    'summary': "Tauri integration for Odoo",
    'description': """
        This module provides Tauri service integration, such as closing the splash screen.
    """,
    'author': "Gatut",
    'website': "https://www.example.com",
    'category': 'Technical',
    'version': '0.1',
    'depends': ['base', 'web'],
    'data': [],
    'assets': {
        'web.assets_backend': [
            'odd_tauri/static/src/js/tauri_service.js',
        ],
    },
    'license': 'LGPL-3',
}
