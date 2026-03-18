# -*- coding: utf-8 -*-
from odoo import models, fields, api

class AccountMove(models.Model):
    _inherit = 'account.move'

    # The field 'no_po' exists on sale.order (from imex_inventory_report)
    # We create a related or computed field on account.move to show it.
    
    so_no_po = fields.Char(string='NO PO', compute='_compute_so_no_po', store=True)
    picking_ids = fields.Many2many('stock.picking', string='Deliveries', compute='_compute_picking_ids', help='Deliveries associated with this invoice')

    @api.depends('invoice_line_ids.sale_line_ids.order_id.no_po')
    def _compute_so_no_po(self):
        for move in self:
            # Get all unique NO PO values from linked sales orders
            sales_orders = move.invoice_line_ids.mapped('sale_line_ids.order_id')
            po_values = sales_orders.mapped('no_po')
            # Filter out empty/False values and join
            move.so_no_po = ', '.join([p for p in po_values if p]) if po_values else False

    @api.depends('invoice_line_ids.picking_id')
    def _compute_picking_ids(self):
        for move in self:
            move.picking_ids = move.invoice_line_ids.picking_id