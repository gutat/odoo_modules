/** @odoo-module **/

import { WebClient } from "@web/webclient/webclient";
import { patch } from "@web/core/utils/patch";
import { session } from "@web/session";

/**
 * Odd Themes - Replace "Odoo" in browser tab title with the company name.
 * Reads from session.user_companies which has the structure:
 *   { current_company: <int>, allowed_companies: { <id>: { id, name, ... } } }
 */
patch(WebClient.prototype, {
    setup() {
        super.setup(...arguments);

        let companyName = null;
        try {
            const uc = session.user_companies;
            if (uc && uc.current_company && uc.allowed_companies) {
                const currentId = uc.current_company;
                const company = uc.allowed_companies[currentId];
                if (company && company.name) {
                    companyName = company.name;
                }
            }
        } catch (e) {
            // Fallback silently
        }

        if (companyName) {
            this.title.setParts({ zopenerp: companyName });
        }
    },
});
