# Vue App Build System

This directory contains the source code for the Vue application integrated into Odoo. It is a modern Vue 3 project using the Composition API and Vite for pre-compilation.

## Why a Build Step?

Using a pre-compiled build step ensures:

- **Stability**: Prevents runtime parsing errors in complex Odoo environments.
- **Performance**: Produces optimized, minified bundles with reduced load times.
- **Maintainability**: Allows the use of standard Vue SFC patterns and modern JS features.

## Project Structure

- `src/`: Vue components and Composition API logic.
- `src/main.js`: Main entry point exporting `initVueApp` for the Odoo bridge.
- `vite.config.js`: Configured to output a UMD/IIFE bundle to `../js/dist/`.

## Build Instructions

1. **Navigate to the Vue source directory**:

   ```bash
   cd static/src/vue_src
   ```

2. **Install dependencies** (first time only):

   ```bash
   npm install
   ```

3. **Build the production bundle**:
   ```bash
   npm run build
   ```

The build process generates:

- `../js/dist/vue_app_bundle.iife.js`: The main application logic.
- `../js/dist/style.css`: Bundled component styles.

Odoo is configured to load these files automatically via the `__manifest__.py`.
