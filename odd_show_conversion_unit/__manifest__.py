# -*- coding: utf-8 -*-
{
    'name': "Odd Show Conversion Unit",

    'summary': "Show Box and Bag conversion units",

    'description': """
Display total quantity in Box and Bag (Bal) on delivery orders and inventory quants.
    """,

    'author': "My Company",
    'website': "https://www.yourcompany.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['stock', 'product'],

    # always loaded
    'data': [
        'views/stock_picking_views.xml',
        'views/stock_move_line_views.xml',
        'views/stock_quant_views.xml',
    ],
    'demo': [],
    'license': 'LGPL-3',
}

