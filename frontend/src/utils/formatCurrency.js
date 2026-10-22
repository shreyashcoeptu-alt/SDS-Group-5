/**
 * Formats a numeric price into Indian Rupee (INR) format.
 * Examples:
 *   formatCurrency(45)   => '₹45'
 *   formatCurrency(120.5) => '₹120.50'
 *   formatCurrency(1499) => '₹1,499'
 *
 * @param {number|string} amount
 * @returns {string} Formatted INR currency string
 */
const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

export const formatCurrency = (amount) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(num)) return '₹0';
  return inrFormatter.format(num);
};

export default formatCurrency;
