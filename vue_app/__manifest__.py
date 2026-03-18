# -*- coding: utf-8 -*-
{
    'name': "Vue App",
    'summary': "Vue 3 Integration App",
    'description': """
        A simple integration of Vue 3 without compile step inside Odoo.
    """,
    'author': "Gatut",
    'website': "https://www.google.com",
    'category': 'Customizations',
    'version': '1.0',
    'depends': ['base', 'web', 'mail'],
    'data': [
        'views/menus.xml',
    ],
    'assets': {
        'web.assets_backend': [
            # Ensure Vue is loaded for the bridge
            'vue_app/static/lib/vue/vue.global.prod.js',
            
            # Pre-compiled Vue Bundle
            'vue_app/static/src/js/dist/style.css',
            'vue_app/static/src/js/dist/vue_app_bundle.iife.js',
            
            # Application Bridge
            'vue_app/static/src/js/vue_bridge.js',
            'vue_app/static/src/xml/vue_bridge.xml',
        ],
    },
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
}
