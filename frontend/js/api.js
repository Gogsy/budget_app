export async function fetchBudgetSummary(userId, month) {
  const response = await fetch(`/api/budgets/summary?user_id=${userId}&month=${month}`);
  if (!response.ok) {
    throw new Error('Greška pri dohvaćanju summary podataka.');
  }
  return await response.json();
}
