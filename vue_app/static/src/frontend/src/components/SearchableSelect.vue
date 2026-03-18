<template>
    <div class="position-relative w-100" ref="dropdownRef">
        <div class="input-group input-group-sm dropdown-toggle" @click="toggleDropdown()" style="cursor: pointer;">
            <input type="text" class="form-control" readonly :value="displayValue"
                :placeholder="placeholder || 'Select item...'" style="cursor: pointer; background: white;" />
            <span class="input-group-text bg-white"><i class="fa fa-caret-down text-muted"></i></span>
        </div>

        <div v-if="isOpen" class="position-absolute w-100 bg-white border rounded shadow-sm mt-1 overflow-auto"
            style="z-index: 1000; max-height: 250px;">
            <div class="p-2 border-bottom sticky-top bg-white">
                <input type="text" class="form-control form-control-sm o_search_input" v-model="searchQuery"
                    placeholder="Search..." @click.stop="" autofocus />
            </div>
            <div class="list-group list-group-flush">
                <button v-for="item in filteredItems" :key="item.id" @click="selectItem(item)"
                    class="list-group-item list-group-item-action py-2 text-start fs-tiny border-0">
                    {{ item[labelFieldLocal] }}
                </button>
                <div v-if="filteredItems.length === 0" class="p-3 text-center text-muted fs-tiny">
                    No items found.
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";

const props = defineProps(["items", "modelValue", "placeholder", "labelField", "returnValue"]);
const emit = defineEmits(["update:modelValue", "on-selected"]);

const isOpen = ref(false);
const searchQuery = ref("");
const dropdownRef = ref(null);

const labelFieldLocal = props.labelField || "name";

const filteredItems = computed(() => {
    if (!props.items) return [];
    if (!searchQuery.value) return props.items;
    const q = searchQuery.value.toLowerCase();
    return props.items.filter((item) =>
        (item[labelFieldLocal] || "").toLowerCase().includes(q)
    );
});

const selectedItem = computed(() => {
    if (props.returnValue === "object") return props.modelValue;
    if (!props.items) return null;
    return props.items.find((item) => item.id === props.modelValue) || null;
});

const displayValue = computed(() => {
    return selectedItem.value ? (selectedItem.value[labelFieldLocal] || "") : "";
});

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        searchQuery.value = "";
        nextTick(() => {
            if (dropdownRef.value) {
                const input = dropdownRef.value.querySelector(".o_search_input");
                if (input) input.focus();
            }
        });
    }
};

const selectItem = (item) => {
    const val = props.returnValue === "object" ? item : item.id;
    emit("update:modelValue", val);
    emit("on-selected", val);
    isOpen.value = false;
};

const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<style scoped>
.fs-tiny {
    font-size: 0.8em;
}
</style>
