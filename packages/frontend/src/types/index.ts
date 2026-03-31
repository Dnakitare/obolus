export interface User {
  id: number;
  email: string;
  displayName: string;
  defaultCurrency: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
  isDefault: boolean;
}

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  amountUSD: number;
  date: string;
  description: string;
  notes?: string;
  categoryId: number;
  category: Pick<Category, 'id' | 'name' | 'icon' | 'color'>;
  isTaxDeductible: boolean;
  receiptPath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: number;
  name: string;
  amount: number;
  currency: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  categoryId: number;
  category: Pick<Category, 'id' | 'name' | 'icon' | 'color'>;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  spent: number;
  remaining: number;
  percentUsed: number;
}

export interface RecurringRule {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  description: string;
  categoryId: number;
  frequency: string;
  dayOfMonth?: number;
  dayOfWeek?: number;
  nextRunDate: string;
  lastRunDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  warnings?: Array<{ budgetId: number; name: string; percentUsed: number }>;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
  period: { start: string; end: string };
}

export interface TrendData {
  month: string;
  income: number;
  expenses: number;
}

export interface CategoryBreakdown {
  categoryId: number;
  categoryName: string;
  color: string;
  icon: string;
  total: number;
  percentage: number;
}

export interface BudgetStatus {
  budgetId: number;
  name: string;
  category: Pick<Category, 'id' | 'name' | 'icon' | 'color'>;
  limit: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  period: string;
}

export interface TaxSummary {
  year: number;
  totalIncome: number;
  totalDeductible: number;
  deductibleByCategory: Array<{ categoryName: string; total: number; count: number }>;
  quarterlyBreakdown: Array<{
    quarter: string;
    income: number;
    expenses: number;
    deductible: number;
    net: number;
  }>;
}

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}
