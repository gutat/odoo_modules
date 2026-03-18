# -*- coding: utf-8 -*-
from odoo import models, fields, api

class ConversionMixin(models.AbstractModel):
    _name = 'conversion.mixin'
    _description = 'Unit Conversion Mixin'

    def _get_conversion_qty(self, quantity, product_uom, search_name):
        """Helper to compute quantity in a specific UoM by name."""
        if not product_uom or not quantity:
            return 0.0
        
        # Search for UoM in the same category
        domain = [
            ('category_id', '=', product_uom.category_id.id),
        ]
        if isinstance(search_name, list):
            domain.append('|')
            for name in search_name:
                domain.append(('name', '=ilike', name))
        else:
            domain.append(('name', '=ilike', search_name))

        target_uom = self.env['uom.uom'].search(domain, limit=1)
        if target_uom:
            return product_uom._compute_quantity(quantity, target_uom)
        return 0.0
