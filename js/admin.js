function formatDate(value) {
  return new Date(value).toLocaleString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function summarizeRsvps(rows) {
  const attending = rows.filter((row) => row.attending === 'yes');
  const declined = rows.filter((row) => row.attending === 'no');

  return {
    totalResponses: rows.length,
    attendingHouseholds: attending.length,
    totalGuests: attending.reduce((sum, row) => sum + (row.guest_count || 0), 0),
    declined: declined.length,
  };
}

function renderStats(stats) {
  const container = document.getElementById('admin-stats');
  if (!container) return;

  const cards = [
    { label: 'Total responses', value: stats.totalResponses },
    { label: 'Households coming', value: stats.attendingHouseholds },
    { label: 'Total guests', value: stats.totalGuests },
    { label: 'Cannot attend', value: stats.declined },
  ];

  container.innerHTML = cards
    .map(
      (card) => `
        <div class="nb-border rounded-2xl bg-[#F9F6F0] p-6 nb-shadow-sm">
          <p class="font-mono-nb text-[11px] uppercase tracking-[0.28em] text-[#5C564F]">${card.label}</p>
          <p class="mt-3 font-heading text-4xl">${card.value}</p>
        </div>
      `
    )
    .join('');
}

function renderTable(rows, filter) {
  const tbody = document.getElementById('admin-table-body');
  const empty = document.getElementById('admin-empty');
  if (!tbody || !empty) return;

  const filtered = rows.filter((row) => {
    if (filter === 'yes') return row.attending === 'yes';
    if (filter === 'no') return row.attending === 'no';
    return true;
  });

  if (!filtered.length) {
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  tbody.innerHTML = filtered
    .map(
      (row) => `
        <tr class="border-t border-[#1F1D1B]/10">
          <td class="px-4 py-4 font-body">${row.name}</td>
          <td class="px-4 py-4 font-mono-nb text-sm">${row.email}</td>
          <td class="px-4 py-4">
            <span class="inline-flex px-3 py-1 rounded-full nb-border text-xs font-mono-nb uppercase tracking-[0.2em] ${
              row.attending === 'yes' ? 'bg-[#C1D5C9]' : 'bg-[#F5E3B8]'
            }">
              ${row.attending === 'yes' ? 'Coming' : 'Declined'}
            </span>
          </td>
          <td class="px-4 py-4 font-heading text-xl text-center">${row.attending === 'yes' ? row.guest_count : '—'}</td>
          <td class="px-4 py-4 font-body text-sm text-[#5C564F] max-w-xs">${row.message || '—'}</td>
          <td class="px-4 py-4 font-mono-nb text-xs text-[#5C564F] whitespace-nowrap">${formatDate(row.created_at)}</td>
          <td class="px-4 py-4 text-center">
            <button
              type="button"
              class="admin-delete-btn"
              data-rsvp-delete
              data-rsvp-id="${row.id}"
              data-rsvp-name="${escapeHtml(row.name)}"
            >
              Delete
            </button>
          </td>
        </tr>
      `
    )
    .join('');
}

function showLogin() {
  document.getElementById('admin-login')?.classList.remove('hidden');
  document.getElementById('admin-dashboard')?.classList.add('hidden');
}

function showDashboard() {
  document.getElementById('admin-login')?.classList.add('hidden');
  document.getElementById('admin-dashboard')?.classList.remove('hidden');
}

function showLoginError(message) {
  const error = document.getElementById('admin-login-error');
  if (!error) return;
  error.textContent = message;
  error.classList.remove('hidden');
}

async function loadRsvps(supabase, filter = 'all') {
  const { data, error } = await supabase
    .from('rsvps')
    .select('id, created_at, name, email, attending, guest_count, message')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const rows = data || [];
  renderStats(summarizeRsvps(rows));
  renderTable(rows, filter);
  return rows;
}

async function initAdmin() {
  const supabase = getSupabaseClient();
  const loginForm = document.getElementById('admin-login-form');
  const logoutButton = document.getElementById('admin-logout');
  const refreshButton = document.getElementById('admin-refresh');
  const filterSelect = document.getElementById('admin-filter');

  if (!supabase) {
    showLogin();
    showLoginError('Supabase is not configured. Add credentials in js/config.js.');
    return;
  }

  let currentFilter = 'all';

  async function refreshDashboard() {
    try {
      await loadRsvps(supabase, currentFilter);
    } catch (error) {
      console.error('Failed to load RSVPs:', error);
      showLogin();
      showLoginError('Could not load RSVPs. Please sign in again.');
    }
  }

  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session) {
    showDashboard();
    await refreshDashboard();
  } else {
    showLogin();
  }

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('admin-email')?.value.trim();
    const password = document.getElementById('admin-password')?.value;

    if (!email || !password) {
      showLoginError('Enter your email and password.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showLoginError(error.message);
      return;
    }

    document.getElementById('admin-login-error')?.classList.add('hidden');
    showDashboard();
    await refreshDashboard();
  });

  logoutButton?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    showLogin();
  });

  refreshButton?.addEventListener('click', refreshDashboard);

  filterSelect?.addEventListener('change', async (event) => {
    currentFilter = event.target.value;
    await refreshDashboard();
  });

  document.getElementById('admin-table-body')?.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-rsvp-delete]');
    if (!button) return;

    const id = button.dataset.rsvpId;
    const name = button.dataset.rsvpName;
    if (!id) return;

    if (!window.confirm(`Delete RSVP from ${name}? This cannot be undone.`)) {
      return;
    }

    button.disabled = true;

    try {
      const { error } = await supabase.from('rsvps').delete().eq('id', id);
      if (error) throw error;
      await refreshDashboard();
    } catch (error) {
      console.error('Failed to delete RSVP:', error);
      window.alert('Could not delete this RSVP. Check Supabase delete permissions.');
      button.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', initAdmin);
