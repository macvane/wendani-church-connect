export const parseAmount = (amt: string | number | undefined) => {
  if (!amt) return 0;
  const cleaned = String(amt).replace(/[^\d.-]/g, '');
  const value = parseFloat(cleaned);
  return isNaN(value) ? 0 : value;
};

export const calculateStats = (transactions: any[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const completed = transactions.filter(t => t.status.toLowerCase() === 'success' || t.status.toLowerCase() === 'completed');
  const pending = transactions.filter(t => t.status.toLowerCase() === 'pending');

  const totalAmount = completed.reduce((sum, t) => sum + parseAmount(t.amount), 0);

  const thisMonthAmount = completed
    .filter(t => {
      const date = new Date(t.transaction_date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);

  const thisYearAmount = completed
    .filter(t => new Date(t.transaction_date).getFullYear() === currentYear)
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);

  const purposeBreakdown: { [key: string]: number } = {};
  completed.forEach(t => {
    const purpose = t.purpose || 'Unknown';
    purposeBreakdown[purpose] = (purposeBreakdown[purpose] || 0) + parseAmount(t.amount);
  });

  return {
    totalAmount,
    totalTransactions: transactions.length,
    avgTransaction: completed.length > 0 ? totalAmount / completed.length : 0,
    completedTransactions: completed.length,
    pendingTransactions: pending.length,
    thisMonthAmount,
    thisYearAmount,
    purposeBreakdown,
  };
};

export const getPurposeChartData = (purposeBreakdown: { [key: string]: number }, totalAmount: number) => 
  Object.entries(purposeBreakdown).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / totalAmount) * 100).toFixed(1),
  }));

export const getMonthlyTrendData = (transactions: any[]) => {
  const monthlyData: { [key: string]: number } = {};
  const completed = transactions.filter(t => t.status.toLowerCase() === 'success' || t.status.toLowerCase() === 'completed');

  completed.forEach(t => {
    const date = new Date(t.transaction_date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    monthlyData[monthYear] = (monthlyData[monthYear] || 0) + parseAmount(t.amount);
  });

  return Object.entries(monthlyData)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(-12)
    .map(([month, amount]) => ({ month, amount }));
};
