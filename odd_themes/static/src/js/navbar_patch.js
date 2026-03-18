/** @odoo-module **/

import { NavBar } from "@web/webclient/navbar/navbar";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { onWillUnmount } from "@odoo/owl";

patch(NavBar.prototype, {
    setup() {
        super.setup();
        this.actionService = useService("action");
        this.menuService = useService("menu");
        this.routerService = useService("router");

        // Force re-render when the action manager actually updates the UI
        // This ensures isOddDashboard is re-evaluated after the new controller is committed
        const onUIUpdated = () => this.render();
        this.env.bus.addEventListener("ACTION_MANAGER:UI-UPDATED", onUIUpdated);
        onWillUnmount(() => {
            this.env.bus.removeEventListener("ACTION_MANAGER:UI-UPDATED", onUIUpdated);
        });
    },

    /**
     * Detection logic for our dashboard.
     */
    get isOddDashboard() {
        const currentController = this.actionService.currentController;
        const action = currentController && currentController.action;
        
        return !!(action && (
            action.context?.is_dashboard || 
            action.xml_id === "odd_themes.odd_action_dashboard_client" ||
            action.tag === "odd_dashboard_client_action"
        ));
    },

    /**
     * Override currentApp to return null on the dashboard.
     * This hides app-specific navbar items (Brand, Sections).
     */
    get currentApp() {
        if (this.isOddDashboard) {
            return null;
        }
        return this.menuService.getCurrentApp();
    },

    /**
     * Navigate to the Home Dashboard and clear state.
     */
    _onHomeClick() {
        this.actionService.doAction("odd_themes.odd_action_dashboard_client", {
            clearBreadcrumbs: true,
        });
        
        // Clear menu state and URL references to previous app
        try {
            this.menuService.setCurrentMenu("root");
            this.routerService.pushState({ menu_id: undefined }, { lock: true });
        } catch (e) {
            console.warn("[Odd Themes] Error clearing menu state:", e);
        }
    }
});
