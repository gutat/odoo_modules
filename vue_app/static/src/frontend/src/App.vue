<template>
    <div class="h-100 w-100">
        <SalesList v-if="view === 'list'" :orders="orders" @open="openRecord" @create="createNew" />
        <SalesForm v-if="view === 'form'" :record="currentRecord" :orderLines="orderLines" :partners="partners"
            :products="products" @back="backToList" @save="saveRecord" @add-product="addProductLine"
            @remove-product="removeProductLine" @update-line-product="updateLineProduct"
            @recalculate-totals="recalculateTotals" />
    </div>
</template>

<script setup>
import { inject, computed } from 'vue';
import { useSales } from './useSales';
import SalesList from './components/SalesList.vue';
import SalesForm from './components/SalesForm.vue';

const rpc = inject('rpc');
const sales = useSales(rpc);

const view = computed(() => sales.currentView.value);
const orders = sales.orders;
const currentRecord = sales.currentRecord;
const orderLines = sales.orderLines;
const partners = sales.partners;
const products = sales.products;

const openRecord = sales.openRecord;
const createNew = sales.createNew;
const backToList = sales.backToList;
const saveRecord = sales.saveRecord;
const addProductLine = sales.addProductLine;
const removeProductLine = sales.removeProductLine;
const updateLineProduct = (payload) => sales.updateLineProduct(payload.line, payload.product);
const recalculateTotals = sales.recalculateTotals;

// Expose currentRecord for the bridge to watch
defineExpose({
    currentRecord
});
</script>
