<template>
    <div class="o_action_manager w-100 h-100 bg-view d-flex flex-column">
        <div class="o_control_panel d-flex flex-column gap-3 gap-lg-1 px-3 pt-2 pb-3"
            style="border-bottom: 1px solid #dee2e6;">
            <div class="o_control_panel_breadcrumbs d-flex align-items-center gap-1 order-0 h-lg-100">
                <div class="o_breadcrumb d-flex flex-row flex-md-column align-items-baseline gap-1 gap-lg-0 lh-sm">
                    <div class="d-flex align-items-center mb-1">
                        <h4 class="mb-0 text-truncate">Quotations</h4>
                        <i class="fa fa-cog ms-2 text-muted" style="cursor: pointer;"></i>
                    </div>
                </div>
            </div>
            <div class="o_control_panel_actions d-flex align-items-center order-2 order-lg-1 gap-2">
                <button type="button" class="btn btn-primary o_list_button_add" @click="createNew()">New</button>
            </div>
            <div
                class="o_control_panel_navigation d-flex flex-wrap flex-md-nowrap justify-content-end gap-3 gap-lg-1 gap-xl-3 order-1 order-lg-2 ms-auto">
                <div class="o_cp_searchview d-flex input-group rounded-pill border h-100" role="search"
                    style="max-width: 400px; background: white;">
                    <button class="btn btn-link py-0 px-2 text-muted"> <i class="fa fa-search"></i> </button>
                    <div
                        class="o_searchview_input_container d-flex flex-grow-1 flex-wrap gap-1 w-100 py-1 pe-2 align-items-center">
                        <span class="badge rounded-pill text-bg-light border bg-opacity-50">
                            <i class="fa fa-filter me-1"></i>My Quotations
                            <i class="fa fa-times o_facet_remove ms-1" style="cursor: pointer;"></i>
                        </span>
                        <input type="text" class="o_searchview_input flex-grow-1 w-auto border-0 p-0"
                            placeholder="Search..." style="outline: none; min-width: 50px;" />
                    </div>
                </div>
                <!-- Pagination / Pager placeholder -->
                <div class="o_cp_pager d-flex align-items-center gap-1 h-100 text-nowrap">
                    <span class="o_pager_value">1-{{ orders.length }}</span>
                    <span> / </span>
                    <span class="o_pager_limit">{{ orders.length }}</span>
                    <span class="btn-group border ms-2 rounded">
                        <button type="button" class="btn btn-sm btn-light py-0 border-0"><i
                                class="fa fa-chevron-left"></i></button>
                        <button type="button" class="btn btn-sm btn-light py-0 border-0"><i
                                class="fa fa-chevron-right"></i></button>
                    </span>
                </div>
                <div class="o_cp_switch_buttons d-flex align-items-center gap-1 btn-group border rounded">
                    <button class="btn btn-sm btn-light py-0 border-0 active"><i class="fa fa-list"></i></button>
                    <button class="btn btn-sm btn-light py-0 border-0"><i class="fa fa-th-large"></i></button>
                    <button class="btn btn-sm btn-light py-0 border-0"><i class="fa fa-clock-o"></i></button>
                    <button class="btn btn-sm btn-light py-0 border-0"><i class="fa fa-calendar"></i></button>
                    <button class="btn btn-sm btn-light py-0 border-0"><i class="fa fa-bar-chart"></i></button>
                    <button class="btn btn-sm btn-light py-0 border-0"><i class="fa fa-table"></i></button>
                </div>
            </div>
        </div>

        <div class="o_content flex-grow-1 overflow-auto bg-view">
            <div class="o_list_view">
                <table class="o_list_table table table-sm table-hover table-striped mb-0 text-nowrap">
                    <thead>
                        <tr class="text-muted border-bottom" style="font-size: 0.9em;">
                            <th class="o_list_record_selector" style="width: 32px; padding-left: 1rem;"><input
                                    type="checkbox" /></th>
                            <th>Number</th>
                            <th>Creation Date</th>
                            <th>Customer</th>
                            <th>Salesperson</th>
                            <th>Activities</th>
                            <th class="text-end">Total</th>
                            <th>Status</th>
                            <th>Partner Type</th>
                            <th>Payment Terms</th>
                            <th style="width:30px;"></th>
                        </tr>
                    </thead>
                    <tbody class="ui-sortable">
                        <tr class="o_data_row" v-for="order in orders" :key="order.id" @click="openRecord(order)"
                            style="cursor: pointer; border-bottom: 1px solid #eee;">
                            <td class="o_list_record_selector" style="padding-left: 1rem;" @click.stop=""><input
                                    type="checkbox" /></td>
                            <td class="text-dark fw-bold">{{ order.name || order.number }}</td>
                            <td class="text-muted">{{ order.date_order || order.creation_date }}</td>
                            <td class="text-dark">{{ Array.isArray(order.partner_id) ? order.partner_id[1] :
                                order.customer }}</td>
                            <td>
                                <span class="badge bg-primary rounded-circle me-1"
                                    style="width:20px; height:20px; display:inline-block; text-align:center; padding: 2px;">
                                    {{ order.user_id ? order.user_id[1].charAt(0) : 'A' }}
                                </span>
                                <span class="text-muted">{{ Array.isArray(order.user_id) ? order.user_id[1] :
                                    order.salesperson }}</span>
                            </td>
                            <td><i class="fa fa-clock-o text-muted"></i></td>
                            <td class="text-end text-dark">{{ formatCurrency(order.amount_total || order.total) }}</td>
                            <td>
                                <span class="badge rounded-pill"
                                    :class="(order.state === 'sale' || order.status === 'Sales Order') ? 'text-bg-success' : 'text-bg-light border'">{{
                                        order.state || order.status }}</span>
                            </td>
                            <td class="text-muted">{{ order.partner_type || 'Company' }}</td>
                            <td class="text-muted">{{ Array.isArray(order.payment_term_id) ? order.payment_term_id[1] :
                                order.payment_terms }}</td>
                            <td></td>
                        </tr>
                        <tr v-if="orders.length === 0">
                            <td colspan="11" class="text-center py-4 text-muted">Loading orders...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatCurrency } from "../utils";

const props = defineProps(["orders"]);
const emit = defineEmits(["open", "create"]);

const openRecord = (order) => {
    emit("open", order);
};

const createNew = () => {
    emit("create");
};
</script>
