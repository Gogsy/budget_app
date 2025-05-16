// MOCK funkcije za API pozive (zamijeni pravim endpointima kad budeš imao backend podršku)
async function fetchDashboardData() {
  // Ovdje bi pozvao pravi endpoint
  const res = await fetch('/api/transactions?user_id=1');
  const transactions = await res.json();

if (!Array.isArray(transactions)) {
  console.error('Nevaljan odgovor sa servera:', transactions);
  throw new Error('Transakcije nisu niz – provjeri backend!');
}
  return {
    transactions,
    totalBalance: transactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + parseFloat(t.amount) : sum - parseFloat(t.amount);
    }, 0),
    categoryTotals: groupByCategory(transactions),
    dailyTotals: groupByDay(transactions)
  };
}

function groupByCategory(transactions) {
  const map = {};
  transactions.forEach(t => {
    if (t.type === 'expense') {
      map[t.category] = (map[t.category] || 0) + parseFloat(t.amount);
    }
  });
  return map;
}

function groupByDay(transactions) {
  const daily = {};
  transactions.forEach(t => {
    const date = new Date(t.created_at).toISOString().split('T')[0];
    daily[date] = (daily[date] || 0) + (t.type === 'expense' ? parseFloat(t.amount) : 0);
  });
  return daily;
}

function renderDashboardCards({ totalBalance, transactions }) {
  document.getElementById('total-balance').textContent = `💰 Ukupno stanje: ${totalBalance.toFixed(2)} €`;
  document.getElementById('total-budget').textContent = `📅 Budžet za mjesec: N/A`; // TODO
  document.getElementById('total-spent').textContent = `🔥 Potrošeno: ${
    transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2)
  } €`;
  document.getElementById('total-transactions').textContent = `📥 Transakcija: ${transactions.length}`;
}

function renderCategoryChart(data) {
  if (window.categoryChart) window.categoryChart.destroy();
const ctx = document.getElementById('categoryChart').getContext('2d');
window.categoryChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: 'Troškovi po kategorijama',
        data: Object.values(data),
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff']
      }]
      
    }
    
  });
}

function renderDailyChart(data) {
 if (window.dailyChart) window.dailyChart.destroy();
const ctx = document.getElementById('dailyChart').getContext('2d');
window.dailyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: 'Dnevna potrošnja (€)',
        data: Object.values(data),
        backgroundColor: '#00d1b2'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

export async function loadDashboard() {
  const data = await fetchDashboardData();
  renderDashboardCards(data);
  renderCategoryChart(data.categoryTotals);
  renderDailyChart(data.dailyTotals);
}
