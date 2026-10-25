/**
 * Utility for formatting currency in Indian Rupees (INR)
 */
export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  
  const num = Number(amount);
  const isInteger = Number.isInteger(num);
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: isInteger ? 0 : 2,
    minimumFractionDigits: isInteger ? 0 : 2,
  }).format(num);
}
