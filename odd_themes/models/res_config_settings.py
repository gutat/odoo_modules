# -*- coding: utf-8 -*-
from odoo import api, fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    odd_primary_color = fields.Char(
        string='Primary Color',
        config_parameter='odd_themes.primary_color',
        default='#714B67',
        help='The primary accent color used throughout the Odoo backend UI.',
    )
