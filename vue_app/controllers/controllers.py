# -*- coding: utf-8 -*-
# from odoo import http


# class VueApp(http.Controller):
#     @http.route('/vue_app/vue_app', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/vue_app/vue_app/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('vue_app.listing', {
#             'root': '/vue_app/vue_app',
#             'objects': http.request.env['vue_app.vue_app'].search([]),
#         })

#     @http.route('/vue_app/vue_app/objects/<model("vue_app.vue_app"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('vue_app.object', {
#             'object': obj
#         })

