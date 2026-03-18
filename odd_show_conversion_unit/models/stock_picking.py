# -*- coding: utf-8 -*-
from odoo import models, fields, api

class StockPicking(models.Model):
    _inherit = 'stock.picking'

    total_box_count = fields.Float(string='Total Boxes', compute='_compute_total_conversion_units')
    total_bag_count = fields.Float(string='Total Bags', compute='_compute_total_conversion_units')

    @api.depends('move_ids_without_package.box_count', 'move_ids_without_package.bag_count')
    def _compute_total_conversion_units(self):
        for picking in self:
            picking.total_box_count = sum(picking.move_ids_without_package.mapped('box_count'))
            picking.total_bag_count = sum(picking.move_ids_without_package.mapped('bag_count'))
