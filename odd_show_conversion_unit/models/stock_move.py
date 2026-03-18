# -*- coding: utf-8 -*-
from odoo import models, fields, api

class StockMove(models.Model):
    _name = 'stock.move'
    _inherit = ['stock.move', 'conversion.mixin']

    box_count = fields.Float(string='Box Count', compute='_compute_conversion_units', digits='Product Unit of Measure', store=False)
    bag_count = fields.Float(string='Bag Count', compute='_compute_conversion_units', digits='Product Unit of Measure', store=False)

    @api.depends('product_uom_qty', 'product_uom')
    def _compute_conversion_units(self):
        for move in self:
            move.box_count = self._get_conversion_qty(move.product_uom_qty, move.product_uom, 'box')
            move.bag_count = self._get_conversion_qty(move.product_uom_qty, move.product_uom, 'bag')
