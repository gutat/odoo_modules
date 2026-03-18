/** @odoo-module **/

import { WebClient } from "@web/webclient/webclient";
import { patch } from "@web/core/utils/patch";
import { onMounted } from "@odoo/owl";
import { registry } from "@web/core/registry";

function getTauri() {
    return window.__TAURI__ || null;
}

function getTauriInvoke() {
    const tauri = getTauri();
    if (!tauri) return null;
    if (typeof tauri.invoke === "function") return tauri.invoke;
    if (tauri.core && typeof tauri.core.invoke === "function")
        return tauri.core.invoke;
    return null;
}

function getTauriListen() {
    const tauri = getTauri();
    if (!tauri) return null;
    if (tauri.event && typeof tauri.event.listen === "function")
        return tauri.event.listen;
    // Tauri v2 often puts listen in 'event' if global is enabled
    return null;
}

export const tauriService = {
    start(env) {
        const invoke = getTauriInvoke();
        const listen = getTauriListen();

        return {
            async invoke(command, args = {}) {
                if (invoke) {
                    return invoke(command, args);
                }
                console.warn(
                    `Tauri command '${command}' skipped. invoke function not found.`,
                );
                return null;
            },

            async listen(eventName, callback) {
                if (listen) {
                    return listen(eventName, callback);
                }
                console.warn(
                    `Tauri listen for '${eventName}' skipped. listen function not found.`,
                );
                return () => {}; // Return dummy unlisten
            },

            // Serial Port Helpers
            async getSerialPorts() {
                return this.invoke("get_serial_ports");
            },

            async startScaleListener(portName, baudRate = 9600, dataBits = 8) {
                return this.invoke("start_scale_listener", {
                    portName: portName,
                    baudRate: baudRate,
                    dataBits: dataBits,
                });
            },

            async stopScaleListener(portName) {
                return this.invoke("stop_scale_listener", {
                    portName: portName,
                });
            },
        };
    },
};

registry.category("services").add("tauri", tauriService);

patch(WebClient.prototype, {
    setup() {
        super.setup();
        onMounted(() => {
            const invoke = getTauriInvoke();
            if (invoke) {
                console.log("Tauri detected, invoking close_splashscreen...");
                invoke("close_splashscreen").catch((err) => {
                    console.error("Failed to close Tauri splashscreen:", err);
                });
            } else {
                console.log("Tauri not detected");
            }
        });
    },
});
