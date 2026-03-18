/** @odoo-module **/

import { registry } from "@web/core/registry";
import { FloatField, floatField } from "@web/views/fields/float/float_field";
import { useService } from "@web/core/utils/hooks";
import { Component, useState, onWillDestroy } from "@odoo/owl";

export class ScaleFloatField extends Component {
    setup() {
        super.setup();
        this.tauri = useService("tauri");
        this.notification = useService("notification");
        this.scaleState = useState({
            isListening: false,
            liveWeight: 0.00,
        });
        this.unlisten = null;

        onWillDestroy(() => {
            if (this.scaleState.isListening) {
                this.stopListening(true);
            }
        });
    }

    async toggleScaleRead() {
        if (this.scaleState.isListening) {
            await this.stopListening();
            return;
        }

        const portName = window.localStorage.getItem("tauri_scale_port");
        const baudRate = parseInt(window.localStorage.getItem("tauri_scale_baud")) || 9600;
        const dataBits = parseInt(window.localStorage.getItem("tauri_scale_databits")) || 8;

        if (!portName) {
            this.notification.add("Please configure the Scale Port in the Scale Testing menu first.", { type: "danger" });
            return;
        }

        this.scaleState.isListening = true;
        this.scaleState.liveWeight = this.props.record.data[this.props.name] || 0.00;

        try {
            await this.tauri.startScaleListener(portName, baudRate, dataBits);
            
            // Wait for scale data
            this.unlisten = await this.tauri.listen("scale-data", (event) => {
                const weightVal = parseFloat(event.payload);
                if (!isNaN(weightVal) && weightVal > 0) {
                    // Update only local reactive state, completely eliminating Odoo lag!
                    this.scaleState.liveWeight = weightVal;
                }
            });
            this.notification.add(`Reading scale from ${portName}... Click stop when stable.`, { type: "info" });
        } catch (error) {
            this.scaleState.isListening = false;
            this.notification.add(`Error starting listener: ${error}`, { type: "danger" });
        }
    }

    async stopListening(skipUpdate = false) {
        if (this.unlisten) {
            this.unlisten();
            this.unlisten = null;
        }

        // Apply final weight to the Odoo record exactly once!
        if (!skipUpdate && this.scaleState.isListening && this.scaleState.liveWeight > 0) {
            try {
                await this.props.record.update({ [this.props.name]: this.scaleState.liveWeight });
            } catch (e) {
                // If the component is already being destroyed, this might fail silently which is fine
                console.warn("Failed to update record during stopListening:", e);
            }
        }

        const portName = window.localStorage.getItem("tauri_scale_port");
        if (portName && this.scaleState.isListening) {
            try {
                await this.tauri.stopScaleListener(portName);
            } catch (e) {
                console.error("Error stopping scale listener:", e);
            }
        }
        this.scaleState.isListening = false;
    }
}

ScaleFloatField.template = "odd_scale.ScaleFloatField";
ScaleFloatField.components = { FloatField };

export const scaleFloatField = {
    ...floatField,
    component: ScaleFloatField,
};

registry.category("fields").add("tauri_scale", scaleFloatField);
