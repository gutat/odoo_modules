import { ref } from "vue";

export function useSales(rpc) {
  const currentView = ref("list"); // 'list' | 'form'
  const currentRecord = ref(null);
  const orders = ref([]);
  const orderLines = ref(null);
  const partners = ref([]);
  const products = ref([]);

  // Fetch real data from Odoo DB via RPC
  const fetchOrders = async () => {
    try {
      const result = await rpc("/web/dataset/call_kw/sale.order/search_read", {
        model: "sale.order",
        method: "search_read",
        args: [
          [], // domain
          [
            "name",
            "date_order",
            "partner_id",
            "user_id",
            "amount_total",
            "state",
            "payment_term_id",
            "validity_date",
            "client_order_ref",
            "pricelist_id",
            "amount_untaxed",
            "amount_tax",
          ],
        ],
        kwargs: { limit: 80, order: "id desc" },
      });
      orders.value = result;
    } catch (e) {
      console.error("Error fetching orders via RPC:", e);
    }
  };

  const fetchOrderLines = async (orderId) => {
    orderLines.value = null; // Trigger loading state
    try {
      const result = await rpc(
        "/web/dataset/call_kw/sale.order.line/search_read",
        {
          model: "sale.order.line",
          method: "search_read",
          args: [
            [["order_id", "=", orderId]], // domain
            [
              "product_id",
              "name",
              "product_uom_qty",
              "qty_delivered",
              "qty_invoiced",
              "product_uom",
              "price_unit",
              "tax_id",
              "price_subtotal",
            ],
          ],
          kwargs: {},
        },
      );
      orderLines.value = result;
    } catch (e) {
      console.error("Error fetching order lines via RPC:", e);
    }
  };

  const fetchPartners = async () => {
    if (partners.value.length > 0) return;
    try {
      const result = await rpc("/web/dataset/call_kw/res.partner/search_read", {
        model: "res.partner",
        method: "search_read",
        args: [[["customer_rank", ">", 0]], ["name", "email"]],
        kwargs: { limit: 100 },
      });
      partners.value = result;
    } catch (e) {
      console.error("Error fetching partners:", e);
    }
  };

  const fetchProducts = async () => {
    if (products.value.length > 0) return;
    try {
      const result = await rpc(
        "/web/dataset/call_kw/product.product/search_read",
        {
          model: "product.product",
          method: "search_read",
          args: [[["sale_ok", "=", true]], ["name", "list_price", "uom_id"]],
          kwargs: { limit: 100 },
        },
      );
      products.value = result;
    } catch (e) {
      console.error("Error fetching products:", e);
    }
  };

  // Initialize data
  fetchOrders();

  const openRecord = (record) => {
    currentRecord.value = record;
    currentView.value = "form";
    fetchOrderLines(record.id);
  };

  const createNew = () => {
    currentRecord.value = {
      id: false,
      name: "New",
      partner_id: false,
      date_order: new Date().toISOString().split("T")[0],
      amount_total: 0,
      amount_untaxed: 0,
      amount_tax: 0,
      state: "draft",
    };
    orderLines.value = [];
    currentView.value = "form";
    fetchPartners();
    fetchProducts();
  };

  const recalculateTotals = () => {
    if (!orderLines.value) return;
    const untaxed = orderLines.value.reduce(
      (acc, line) => acc + (line.price_unit * line.product_uom_qty || 0),
      0,
    );
    currentRecord.value.amount_untaxed = untaxed;
    currentRecord.value.amount_total = untaxed * 1.15; // Placeholder tax logic
  };

  const addProductLine = () => {
    const newLine = {
      id: "_" + Math.random().toString(36).substr(2, 9),
      product_id: false,
      name: "",
      product_uom_qty: 1,
      price_unit: 0,
      price_subtotal: 0,
      product_uom: false,
    };
    orderLines.value.push(newLine);
  };

  const removeProductLine = (lineId) => {
    orderLines.value = orderLines.value.filter((l) => l.id !== lineId);
    recalculateTotals();
  };

  const updateLineProduct = (line, product) => {
    if (!product) {
      line.product_id = false;
      line.name = "";
      line.price_unit = 0;
    } else {
      line.product_id = [product.id, product.name];
      line.name = product.name;
      line.price_unit = product.list_price;
    }
    line.price_subtotal = line.price_unit * line.product_uom_qty;
    recalculateTotals();
  };

  const saveRecord = async (data) => {
    try {
      const lines = orderLines.value
        .filter((l) => l.product_id) // Filter out empty lines
        .map((l) => {
          return [
            0,
            0,
            {
              product_id: Array.isArray(l.product_id)
                ? l.product_id[0]
                : l.product_id,
              product_uom_qty: l.product_uom_qty,
              price_unit: l.price_unit,
            },
          ];
        });

      if (!data.id) {
        // Create new record
        const res = await rpc("/web/dataset/call_kw/sale.order/create", {
          model: "sale.order",
          method: "create",
          args: [
            {
              partner_id: data.partner_id,
              date_order: data.date_order,
              client_order_ref: data.client_order_ref,
              order_line: lines,
            },
          ],
          kwargs: {},
        });
        console.log("Record created:", res);
      } else {
        // Update existing (minimal implementation for now)
        await rpc("/web/dataset/call_kw/sale.order/write", {
          model: "sale.order",
          method: "write",
          args: [
            [data.id],
            {
              partner_id: data.partner_id,
              date_order: data.date_order,
              client_order_ref: data.client_order_ref,
              // We might need a better way to handle line updates for existing records
            },
          ],
          kwargs: {},
        });
      }
      // Refresh and go back
      await fetchOrders();
      backToList();
    } catch (e) {
      console.error("Error saving record:", e);
      throw e;
    }
  };

  const backToList = () => {
    currentRecord.value = null;
    orderLines.value = null;
    currentView.value = "list";
  };

  return {
    currentView,
    currentRecord,
    orders,
    orderLines,
    partners,
    products,
    openRecord,
    createNew,
    addProductLine,
    removeProductLine,
    updateLineProduct,
    recalculateTotals,
    saveRecord,
    backToList,
  };
}
