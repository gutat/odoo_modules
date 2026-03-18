# -*- coding: utf-8 -*-
from odoo import models, fields, api

class StockQuant(models.Model):
    _name = 'stock.quant'
    _inherit = ['stock.quant', 'conversion.mixin']

    box_count = fields.Float(string='Box Count', compute='_compute_conversion_units', digits='Product Unit of Measure', store=False)
    bag_count = fields.Float(string='Bag Count', compute='_compute_conversion_units', digits='Product Unit of Measure', store=False)

    @api.depends('inventory_quantity_auto_apply', 'quantity', 'product_uom_id')
    def _compute_conversion_units(self):
        for quant in self:
            # Uses the quantity being displayed in the list view (which is usually 'quantity' or the editable qty)
            qty = quant.quantity or quant.inventory_quantity_auto_apply
            quant.box_count = self._get_conversion_qty(qty, quant.product_uom_id, 'box')
            quant.bag_count = self._get_conversion_qty(qty, quant.product_uom_id, ['bag', 'bal'])
