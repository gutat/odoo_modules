# Odd Tauri

Integrates Odoo with Tauri.

## Features

- Closes the Tauri splash screen when the Odoo web client is mounted.
- Detects if running inside a Tauri environment using `window.__TAURI__`.

## Requirements

The Odoo instance must be served within a Tauri WebView where `window.__TAURI__` is injected.
