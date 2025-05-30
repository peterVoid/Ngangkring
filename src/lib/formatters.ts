export function formatCurrency(
  amount: number,
  { showZeroAsNumber = false } = {},
) {
  const format = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  if (amount === 0 && showZeroAsNumber) {
    return "free";
  }

  return format.format(amount);
}

export function formatDate(
  date: Date,
  fromCustomerHistoryPage: boolean = false,
) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    ...(fromCustomerHistoryPage && {
      timeStyle: "long",
    }),
  }).format(date);
}
