import { createApp } from "vue";
import App from "./App.vue";

export function initVueApp(targetEl, { rpc, user }) {
  const app = createApp(App);

  app.provide("rpc", rpc);
  app.provide("user", user);

  const instance = app.mount(targetEl);
  return instance;
}
