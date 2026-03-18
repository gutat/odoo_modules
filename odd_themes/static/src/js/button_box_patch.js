/** @odoo-module **/

import { ButtonBox } from "@web/views/form/button_box/button_box";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { onWillRender } from "@odoo/owl";

/**
 * Aggressive patch for ButtonBox to show ALL buttons by default.
 * We override the setup entirely to prevent the original hardcoded limits
 * from being registered as a hook.
 */
patch(ButtonBox.prototype, {
    setup() {
        // We do NOT call super.setup() to avoid the original onWillRender hook
        // which has hardcoded limits (3, 4, 5, 7, etc.)
        
        this.ui = useService("ui");
        
        onWillRender(() => {
            const allVisibleButtons = Object.entries(this.props.slots)
                .filter(([_, slot]) => this.isSlotVisible(slot))
                .map(([slotName]) => slotName);
            
            const maxVisibleButtons = 5;

            if (allVisibleButtons.length <= maxVisibleButtons) {
                this.visibleButtons = allVisibleButtons;
                this.additionalButtons = [];
                this.isFull = allVisibleButtons.length === maxVisibleButtons;
            } else {
                // -1 for "More" dropdown
                this.visibleButtons = allVisibleButtons.slice(0, maxVisibleButtons - 1);
                this.additionalButtons = allVisibleButtons.slice(maxVisibleButtons - 1);
                this.isFull = true;
            }
        });
    }
});
