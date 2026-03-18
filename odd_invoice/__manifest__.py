# -*- coding: utf-8 -*-
{
    'name': "Odd Invoice",

    'summary': "Show Sales Order NO PO on Invoices",

    'description': """
Links and displays the 'NO PO' field from related Sales Orders on the Invoice form.
    """,

    'author': "My Company",
    'website': "https://www.yourcompany.com",

    'category': 'Accounting',
    'version': '0.1',

    'depends': ['account', 'sale', 'imex_inventory_report'],

    'data': [
        'views/account_move_views.xml',
    ],
    'installable': True,
    'license': 'LGPL-3',
}
