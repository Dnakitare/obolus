export function useCurrency() {
  function formatAmount(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  function formatUSD(amount: number): string {
    return formatAmount(amount, 'USD');
  }

  return { formatAmount, formatUSD };
}
