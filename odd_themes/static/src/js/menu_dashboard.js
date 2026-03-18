/** @odoo-module **/

import { KanbanRecord } from "@web/views/kanban/kanban_record";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";

console.log("[Odd Themes] menu_dashboard.js loaded successfully - v2");

patch(KanbanRecord.prototype, {
    setup() {
        super.setup();
        this.menuService = useService("menu");
    },

    /**
     * Intercept clicks on the Kanban record.
     * Since t-on-click is forbidden in XML arch, we use the standard onGlobalClick hook.
     */
    onGlobalClick(ev) {
        // Log target for debugging
        console.log("[Odd Themes] onGlobalClick triggered", ev.target);

        // Check if we are in our custom menu dashboard and clicking an app card
        if (this.props.record.resModel === "ir.ui.menu" && ev.target.closest(".o_odd_app_card")) {
            console.log("[Odd Themes] App card click detected!");
            
            // Stop Odoo's default behavior
            ev.stopPropagation();
            ev.preventDefault();

            const menuId = this.props.record.resId;
            const menuName = this.props.record.data.name;

            if (menuName === "Apps") {
                console.log("[Odd Themes] Apps menu clicked - redirecting to module list");
                this.actionService.doAction("base.action_module_open_list");
                return;
            }

            if (menuId) {
                console.log("[Odd Themes] Navigating to Menu ID:", menuId);
                this.menuService.selectMenu(parseInt(menuId));
                return;
            }
        }
        
        // Fallback to default Odoo behavior for other Kanban records
        return super.onGlobalClick(ev);
    }
});
