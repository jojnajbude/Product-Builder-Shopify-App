export default function moneyFormat(price, currency) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency || 'USD',
  });

  return formatter.format(Number(price));
};