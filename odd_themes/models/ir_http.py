# -*- coding: utf-8 -*-
from odoo import models
from odoo.http import request


class Http(models.AbstractModel):
    _inherit = 'ir.http'

    def session_info(self):
        """ Override session_info to redirect users to the Odd Apps view upon login. """
        res = super(Http, self).session_info()
        user = self.env.user
        
        # Check if the user has access to our custom apps view (belongs to base.group_system)
        if user.has_group('base.group_system'):
            action = self.env.ref('odd_themes.odd_action_dashboard_client', raise_if_not_found=False)
            if action:
                # 'home_action_id' is used by the web client to determine the landing page
                res['home_action_id'] = action.id
        
        return res
