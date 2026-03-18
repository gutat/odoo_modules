/** @odoo-module **/

import { Component, onWillStart } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { registry } from "@web/core/registry";

export class OddDashboard extends Component {
    setup() {
        this.menuService = useService("menu");
        this.actionService = useService("action");

        onWillStart(async () => {
            this.menus = this.menuService.getApps();
        });
    }

    onMenuClick(menu) {
        if (menu.xmlid === "base.menu_management") {
            this.actionService.doAction("base.open_module_tree", {
                clearBreadcrumbs: true,
            }).then(() => {
                this.menuService.setCurrentMenu(menu);
            });
        } else {
            this.menuService.selectMenu(menu);
        }
    }
}

OddDashboard.template = "odd_themes.DashboardView";

registry.category("actions").add("odd_dashboard_client_action", OddDashboard);
