/** @odoo-module **/

import { Component, useState, onWillStart } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { registry } from "@web/core/registry";

export class ScaleTest extends Component {
    setup() {
        this.tauri = useService("tauri");
        this.state = useState({
            ports: [],
            selectedPort: window.localStorage.getItem("tauri_scale_port") || "",
            baudRate: window.localStorage.getItem("tauri_scale_baud") || 9600,
            dataBits: window.localStorage.getItem("tauri_scale_databits") || 8,
            isListening: false,
            currentWeight: "0.00",
            statusMessage: "Disconnected",
            logs: [],
        });

        onWillStart(async () => {
            await this.refreshPorts();
        });
    }

    async refreshPorts() {
        try {
            const ports = await this.tauri.getSerialPorts();
            this.state.ports = ports || [];
            this.addLog("Available ports refreshed.");
        } catch (error) {
            this.addLog(`Error fetching ports: ${error}`, "error");
        }
    }

    async toggleListen() {
        if (this.state.isListening) {
            await this.stopListen();
        } else {
            await this.startListen();
        }
    }

    async startListen() {
        if (!this.state.selectedPort) {
            this.state.statusMessage = "Please select a port";
            return;
        }

        try {
            window.localStorage.setItem("tauri_scale_port", this.state.selectedPort);
            window.localStorage.setItem("tauri_scale_baud", this.state.baudRate);
            window.localStorage.setItem("tauri_scale_databits", this.state.dataBits);

            this.addLog(`Connecting to ${this.state.selectedPort}...`);
            await this.tauri.startScaleListener(
                this.state.selectedPort,
                parseInt(this.state.baudRate),
                parseInt(this.state.dataBits)
            );
            this.state.isListening = true;
            this.state.statusMessage = `Connected to ${this.state.selectedPort}`;
            this.addLog(`Started listening on ${this.state.selectedPort}`);

            // Listen for scale data events from Tauri
            this.unlisten = await this.tauri.listen("scale-data", (event) => {
                if (parseFloat(event.payload) > 0.1) {
                    this.state.currentWeight = event.payload;
                }
                this.addLog(`data : ${this.state.currentWeight}`, "info");
            });
        } catch (error) {
            this.state.statusMessage = "Connection failed";
            this.addLog(`Error starting listener: ${error}`, "error");
        }
    }

    async stopListen() {
        try {
            await this.tauri.stopScaleListener(this.state.selectedPort);
            if (this.unlisten) {
                this.unlisten();
            }
            this.state.isListening = false;
            this.state.statusMessage = "Disconnected";
            this.addLog(`Stopped listening on ${this.state.selectedPort}`);
        } catch (error) {
            this.addLog(`Error stopping listener: ${error}`, "error");
        }
    }

    addLog(message, type = "info") {
        this.state.logs.unshift({
            time: new Date().toLocaleTimeString(),
            text: message,
            type: type,
        });
        if (this.state.logs.length > 50) {
            this.state.logs.pop();
        }
    }
}

ScaleTest.template = "odd_scale.ScaleTest";

registry.category("actions").add("odd_scale.ScaleTest", ScaleTest);
