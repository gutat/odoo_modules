# -*- coding: utf-8 -*-
{
    'name': "Odd Scale",
    'summary': "Serial Scale testing for Odoo using Tauri",
    'description': """
        This module provides a UI for testing serial scale connections
        using the Tauri service from odd_tauri.
    """,
    'author': "Gatut",
    'website': "https://www.example.com",
    'category': 'Technical',
    'version': '0.1',
    'depends': ['base', 'web', 'stock', 'odd_tauri'],
    'data': [
        'views/scale_test_views.xml',
        'views/stock_picking_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'odd_scale/static/src/js/scale_test.js',
            'odd_scale/static/src/xml/scale_test.xml',
            'odd_scale/static/src/js/scale_field.js',
            'odd_scale/static/src/xml/scale_field.xml',
        ],
    },
    'license': 'LGPL-3',
}
