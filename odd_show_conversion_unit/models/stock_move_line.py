# -*- coding: utf-8 -*-
from odoo import models, fields, api

class StockMoveLine(models.Model):
    _name = 'stock.move.line'
    _inherit = ['stock.move.line', 'conversion.mixin']

    box_count = fields.Float(string='Box Count', compute='_compute_conversion_units', digits='Product Unit of Measure', store=False)
    bag_count = fields.Float(string='Bag Count', compute='_compute_conversion_units', digits='Product Unit of Measure', store=False)

    @api.depends('quantity', 'product_uom_id')
    def _compute_conversion_units(self):
        for line in self:
            line.box_count = self._get_conversion_qty(line.quantity, line.product_uom_id, 'box')
            line.bag_count = self._get_conversion_qty(line.quantity, line.product_uom_id, 'bag')
