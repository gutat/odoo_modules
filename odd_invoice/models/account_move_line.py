# -*- coding: utf-8 -*-
from odoo import models, fields

class AccountMoveLine(models.Model):
    _inherit = 'account.move.line'

    picking_id = fields.Many2one('stock.picking', string='Origin Picking')