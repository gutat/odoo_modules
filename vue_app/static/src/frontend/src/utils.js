/**
 * Format number to IDR currency
 */
export const formatCurrency = (val) => {
  if (!val) return "";
  return (
    "Rp " +
    parseFloat(val).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};
