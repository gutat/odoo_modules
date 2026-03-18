<template>
    <div class="o_action_manager w-100 h-100 bg-view d-flex flex-column">
        <div class="o_control_panel d-flex flex-column gap-3 gap-lg-1 px-3 pt-2 pb-3"
            style="border-bottom: 1px solid #dee2e6;">
            <div class="o_control_panel_breadcrumbs d-flex align-items-center gap-1 order-0 h-lg-100">
                <div class="o_breadcrumb d-flex flex-row flex-md-column align-items-baseline gap-1 gap-lg-0 lh-sm">
                    <div class="d-flex align-items-center mb-1">
                        <ol class="breadcrumb mb-0">
                            <li class="breadcrumb-item"><a href="#" @click.prevent="discard()">Quotations</a></li>
                            <li class="breadcrumb-item active">{{ record.name || record.number }}</li>
                        </ol>
                        <i class="fa fa-cog ms-2 text-muted" style="cursor: pointer;"></i>
                    </div>
                </div>
            </div>
            <div class="o_control_panel_actions d-flex align-items-center order-2 order-lg-1 gap-2">
                <button type="button" class="btn btn-primary" @click="save()">Save</button>
                <button type="button" class="btn btn-secondary bg-white" @click="discard()">Discard</button>
            </div>
        </div>

        <div class="o_content flex-grow-1 overflow-hidden bg-view d-flex flex-column flex-xl-row">
            <div class="o_form_view d-flex flex-column flex-grow-1 overflow-auto"
                :class="{ 'o_form_readonly': state.editedRecord.id }" style="min-width: 0;">
                <div class="o_form_sheet_bg d-flex flex-column align-items-center">
                    <div class="o_form_sheet position-relative bg-white border my-4 p-4 shadow-sm"
                        style="width: 95%; max-width: 1140px; min-width: 300px;">
                        <div
                            class="o_form_statusbar position-relative d-flex justify-content-between mb-4 border-bottom pb-3">
                            <div class="o_statusbar_buttons d-flex align-items-center gap-1">
                                <button class="btn btn-primary" v-if="record.state !== 'sale'">Confirm</button>
                            </div>
                            <div
                                class="o_statusbar_status d-flex align-items-center text-end font-weight-bold dropdown_hide">
                                <button type="button" class="btn o_arrow_button text-muted">Quotation</button>
                                <button type="button" class="btn o_arrow_button text-muted">Quotation Sent</button>
                                <button type="button" class="btn o_arrow_button"
                                    :class="(record.state === 'sale' || record.status === 'Sales Order') ? 'btn-primary text-white' : 'text-muted'">Sales
                                    Order</button>
                            </div>
                        </div>

                        <div class="oe_title mb-4">
                            <h1 class="text-break">{{ record.name || record.number }}</h1>
                        </div>

                        <div class="o_group row align-items-start mb-4">
                            <div class="col-lg-6 d-flex flex-column gap-2">
                                <div class="d-flex align-items-baseline">
                                    <label class="o_form_label fw-bold text-dark w-25">Customer</label>
                                    <div v-if="!state.editedRecord.id" class="flex-grow-1">
                                        <SearchableSelect :items="partners" v-model="state.editedRecord.partner_id"
                                            placeholder="Select Customer..." />
                                    </div>
                                    <span v-else="" class="text-primary o_field_widget flex-grow-1">{{
                                        Array.isArray(state.editedRecord.partner_id) ? state.editedRecord.partner_id[1]
                                            : (partners.find(p => p.id === state.editedRecord.partner_id)?.name ||
                                                state.editedRecord.customer)}}</span>
                                </div>
                                <div class="d-flex align-items-baseline">
                                    <label class="o_form_label fw-bold text-dark w-25">Reference</label>
                                    <input v-if="!state.editedRecord.id" type="text"
                                        class="form-control form-control-sm flex-grow-1"
                                        v-model="state.editedRecord.client_order_ref" />
                                    <span v-else="" class="o_field_widget flex-grow-1">{{
                                        state.editedRecord.client_order_ref || state.editedRecord.nopo || '-' }}</span>
                                </div>
                            </div>
                            <div class="col-lg-6 d-flex flex-column gap-2">
                                <div class="d-flex align-items-baseline">
                                    <label class="o_form_label fw-bold text-dark w-25">Order Date</label>
                                    <input v-if="!state.editedRecord.id" type="date"
                                        class="form-control form-control-sm flex-grow-1"
                                        v-model="state.editedRecord.date_order" />
                                    <span v-else="" class="o_field_widget flex-grow-1">{{ state.editedRecord.date_order
                                        || state.editedRecord.creation_date }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="o_notebook d-flex flex-column flex-grow-1 mt-2">
                            <ul class="nav nav-tabs mb-3 border-bottom" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active text-dark fw-bold" href="#">Order Lines</a>
                                </li>
                            </ul>

                            <div class="tab-content flex-grow-1">
                                <div class="tab-pane active h-100">
                                    <div class="table-responsive">
                                        <table class="table table-sm text-nowrap o_list_table table-striped">
                                            <thead>
                                                <tr class="text-muted border-bottom" style="font-size: 0.9em;">
                                                    <th style="width: 32px;"></th>
                                                    <th>Product</th>
                                                    <th>Description</th>
                                                    <th class="text-end">Quantity</th>
                                                    <th class="text-end">Delivered</th>
                                                    <th class="text-end">Invoiced</th>
                                                    <th>UoM</th>
                                                    <th class="text-end">Unit Price</th>
                                                    <th>Taxes</th>
                                                    <th class="text-end">Tax excl.</th>
                                                    <th style="width: 40px;"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-if="orderLines === null" class="border-bottom text-dark">
                                                    <td colspan="11" class="text-center py-4 text-muted"><i
                                                            class="fa fa-circle-o-notch fa-spin me-2"></i>Loading
                                                        lines...</td>
                                                </tr>
                                                <tr v-else-if="orderLines.length" v-for="line in orderLines"
                                                    :key="line.id" class="border-bottom text-dark">
                                                    <td class="text-center text-muted"><i class="fa fa-arrows"></i></td>
                                                    <td>
                                                        <div v-if="!state.editedRecord.id" style="min-width: 200px;">
                                                            <SearchableSelect :items="products"
                                                                :modelValue="line.product_id ? line.product_id[0] : null"
                                                                placeholder="Select Product..." return-value="object"
                                                                @on-selected="(p) => onProductChange(line, p)" />
                                                        </div>
                                                        <span v-else="">{{ Array.isArray(line.product_id) ?
                                                            line.product_id[1] : line.product }}</span>
                                                    </td>
                                                    <td class="text-truncate" style="max-width: 250px;">{{ line.name ||
                                                        line.description }}</td>
                                                    <td class="text-end">
                                                        <input v-if="!state.editedRecord.id" type="number"
                                                            class="form-control form-control-sm text-end d-inline-block"
                                                            style="width: 80px;" v-model.number="line.product_uom_qty"
                                                            @input="onQtyChange()" />
                                                        <span v-else="">{{ line.product_uom_qty || line.qty }}</span>
                                                    </td>
                                                    <td class="text-end">{{ line.qty_delivered || line.delivered || 0 }}
                                                    </td>
                                                    <td class="text-end">{{ line.qty_invoiced || line.invoiced || 0 }}
                                                    </td>
                                                    <td>{{ (Array.isArray(line.product_uom) ? line.product_uom[1] :
                                                        (line.product_uom || line.uom)) || 'Units' }}</td>
                                                    <td class="text-end">
                                                        <input v-if="!state.editedRecord.id" type="number" step="0.01"
                                                            class="form-control form-control-sm text-end d-inline-block"
                                                            style="width: 100px;" v-model.number="line.price_unit"
                                                            @input="onQtyChange()" />
                                                        <span v-else="">{{ formatCurrency(line.price_unit || line.price)
                                                        }}</span>
                                                    </td>
                                                    <td>0%</td>
                                                    <td class="text-end">{{ formatCurrency(line.price_unit *
                                                        line.product_uom_qty) }}</td>
                                                    <td class="text-center">
                                                        <i v-if="!state.editedRecord.id" class="fa fa-trash text-danger"
                                                            style="cursor: pointer;"
                                                            @click="removeProduct(line.id)"></i>
                                                    </td>
                                                </tr>
                                                <tr v-else="">
                                                    <td colspan="11" class="text-center text-muted py-3">No lines found.
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div v-if="!state.editedRecord.id"
                                        class="py-2 mb-3 d-flex align-items-center gap-2 border-top pt-3">
                                        <a href="javascript:void(0)" class="text-primary text-decoration-none me-3"
                                            @click="addProduct()">Add a product</a>
                                        <a href="javascript:void(0)" class="text-primary text-decoration-none me-3">Add
                                            a section</a>
                                        <a href="javascript:void(0)" class="text-primary text-decoration-none me-3">Add
                                            a note</a>
                                        <a href="javascript:void(0)"
                                            class="text-primary text-decoration-none">Catalog</a>
                                    </div>

                                    <div class="row m-0 pt-2 border-top">
                                        <div class="col-sm-6">
                                            <textarea
                                                class="form-control text-muted px-0 bg-transparent border-0 resize-none shadow-none"
                                                placeholder="Terms and conditions..."
                                                style="font-size: 0.9em; height: 100px;"></textarea>
                                        </div>
                                        <div class="col-sm-6 d-flex flex-column align-items-end pe-4 mt-2">
                                            <table class="table-sm table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <td class="text-muted pe-4 text-end">Untaxed Amount:</td>
                                                        <td class="text-end fw-bold">{{
                                                            formatCurrency(record.amount_untaxed ||
                                                                record.untaxed_amount) }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="text-muted pe-4 text-end">Tax 15%:</td>
                                                        <td class="text-end fw-bold">{{ formatCurrency(record.amount_tax
                                                            || record.tax) }}</td>
                                                    </tr>
                                                    <tr class="border-top pt-2 mt-2">
                                                        <td class="pe-4 text-end fs-5">Total:</td>
                                                        <td class="text-end font-weight-bold fs-5 fw-bold">{{
                                                            formatCurrency(record.amount_total || record.total) }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="o_chatter_container border-start bg-view d-flex flex-column shadow-sm overflow-auto"
                style="flex: 0 0 400px; max-width: 100%; min-width: 40dvw;">
                <div id="odoo_chatter_box" class="h-100"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from "vue";
import { formatCurrency } from "../utils";
import SearchableSelect from "./SearchableSelect.vue";

const props = defineProps(["record", "orderLines", "partners", "products"]);
const emit = defineEmits(["back", "save", "add-product", "remove-product", "update-line-product", "recalculate-totals"]);

const state = reactive({
    editedRecord: { ...props.record },
});

const save = () => {
    emit("save", state.editedRecord);
};

const discard = () => {
    emit("back");
};

const addProduct = () => {
    emit("add-product");
};

const removeProduct = (lineId) => {
    emit("remove-product", lineId);
};

const onProductChange = (line, product) => {
    emit("update-line-product", { line, product });
};

const onQtyChange = () => {
    emit("recalculate-totals");
};
</script>
