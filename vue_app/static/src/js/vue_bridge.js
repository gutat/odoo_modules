/** @odoo-module **/

import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Component, onMounted, useRef, useState } from "@odoo/owl";
import { Chatter } from "@mail/core/web/chatter";

const { watch } = Vue;

// --- Main Owl Action ---

export class VueAppAction extends Component {
  static components = { Chatter };

  setup() {
    this.rpc = useService("rpc");
    this.user = useService("user");
    this.vueRoot = useRef("vueRoot");

    // Owl state for Chatter sync
    this.state = useState({
      currentRecordId: null,
    });

    onMounted(() => {
      if (this.vueRoot.el) {
        // App is now initialized from the pre-compiled bundle
        const root = window.VueApp.initVueApp(this.vueRoot.el, {
          rpc: (url, params) => this.rpc(url, params),
          user: this.user,
        });

        // Sync Vue's currentRecord to Owl's state for Chatter
        Vue.watch(
          () => root.currentRecord,
          (newRecord) => {
            this.state.currentRecordId = newRecord ? newRecord.id : null;
          },
          { deep: true },
        );

        this.vueRootInstance = root;
      }
    });
  }

  destroy() {
    if (this.vueApp) {
      this.vueApp.unmount();
    }
    super.destroy();
  }
}

VueAppAction.template = "vue_app.VueAppAction";
registry.category("actions").add("vue_app.action", VueAppAction);
