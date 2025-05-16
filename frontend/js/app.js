
import { fetchBudgetSummary } from './api.js';
import { renderSummary } from './render.js';
import { loadDashboard } from './dashboard.js';

// Navigacija - mijenjanje prikazane sekcije
document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // Skloni sve sekcije
    document.querySelectorAll('.app-section').forEach(section => {
      section.classList.add('hidden');
    });

    // Prikaži odabranu
    const sectionId = link.getAttribute('data-section');
    document.getElementById(sectionId).classList.remove('hidden');

    // Ako je dashboard - učitaj podatke
    if (sectionId === 'dashboard') {
      loadDashboard();
    }
  });
});

// Budget summary prikaz
document.getElementById('load-summary').addEventListener('click', async () => {
  const userId = 1;
  const rawMonth = document.getElementById('month-select').value;
  if (!rawMonth) {
    alert('Odaberi mjesec!');
    return;
  }

  const [yyyy, mm] = rawMonth.split('-');
  const formattedMonth = `01.${mm}.${yyyy}`;

  try {
    const summary = await fetchBudgetSummary(userId, formattedMonth);
    renderSummary(summary);
  } catch (err) {
    console.error(err);
    alert('Nešto je pošlo po zlu. Pokušaj ponovno.');
  }
});

// Dohvati račune i popuni dropdown u transakcijskoj formi + auto-load dashboard ako je aktivan
document.addEventListener('DOMContentLoaded', () => {
  const accountSelect = document.getElementById('account-select');
  const form = document.getElementById('transaction-form');
  const messageDiv = document.getElementById('transaction-message');
  const USER_ID = 1;

  fetch(`/api/accounts?user_id=${USER_ID}`)
    .then(res => res.json())
    .then(accounts => {
      accounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account.id;
        option.textContent = `${account.name} (${account.type}) - ${account.balance} €`;
        accountSelect.appendChild(option);
      });
    })
    .catch(err => {
      console.error('Greška pri dohvaćanju računa:', err);
    });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      user_id: USER_ID,
      account_id: accountSelect.value,
      category: document.getElementById('category').value,
      amount: parseFloat(document.getElementById('amount').value),
      type: document.getElementById('type').value,
      description: document.getElementById('description').value
    };

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        messageDiv.textContent = result.message;
        messageDiv.style.color = 'green';
        form.reset();
      } else {
        messageDiv.textContent = result.error;
        messageDiv.style.color = 'red';
      }
    } catch (err) {
      console.error('Greška prilikom slanja transakcije:', err);
      messageDiv.textContent = 'Došlo je do greške.';
      messageDiv.style.color = 'red';
    }
  });

  // AUTO LOAD DASHBOARD ako je otvoren po defaultu
  const initial = document.querySelector('.app-section:not(.hidden)');
  if (initial && initial.id === 'dashboard') {
    loadDashboard();
  }
});