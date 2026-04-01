export function useCurrency() {
    function formatAmount(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    }
    function formatUSD(amount) {
        return formatAmount(amount, 'USD');
    }
    return { formatAmount, formatUSD };
}
