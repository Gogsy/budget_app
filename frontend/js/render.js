export function renderSummary(summary) {
  const container = document.getElementById('summary-output');
  container.innerHTML = '';

  if (!summary || summary.length === 0) {
    container.innerHTML = '<p>Nema dostupnih podataka za odabrani mjesec.</p>';
    return;
  }

  summary.forEach(item => {
    const div = document.createElement('div');
    div.className = 'budget-item';

    const statusClass = item.warning ? 'warning' : 'success';
    const statusText = item.warning ? '⚠️ Visoka potrošnja!' : '✅ U okviru budžeta';

    div.innerHTML = `
      <strong>${item.category}</strong>
      <span>Limit: ${item.limit.toFixed(2)} €</span>
      <span>Potrošeno: ${item.spent.toFixed(2)} €</span>
      <span>Preostalo: ${item.remaining.toFixed(2)} €</span>
      <span class="${statusClass}">${statusText}</span>
    `;

    container.appendChild(div);
  });
}