<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';
  import { formatDate, showToast } from '../lib/store.js';

  let summary = null;

  onMount(async () => {
    try {
      summary = await api.getParrainageSummary();
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
</script>

<section class="ff-panel ff-section--referral">
  {#if summary}
    <div class="ff-section__head">
      <h1>Parrainage professionnel</h1>
      <p class="ff-section__desc">
        Invitez et suivez vos filleuls — visualisez leurs investissements et les montants rapportés.
      </p>
      <div class="ff-copy-link">
        <strong>Lien de parrainage :</strong>
        <code>{summary.parrainage_link}</code>
      </div>
    </div>

    <div class="ff-stats-row">
      <div class="ff-stat-card">
        <span class="ff-stat-value">{summary.parrainage_count}</span>
        <span class="ff-stat-label">Filleuls</span>
      </div>
      <div class="ff-stat-card ff-stat-card--success">
        <span class="ff-stat-value">{summary.total_invested_all ?? 0}</span>
        <span class="ff-stat-label">Investi par les filleuls (FCFA)</span>
      </div>
      <div class="ff-stat-card ff-stat-card--warning">
        <span class="ff-stat-value">—</span>
        <span class="ff-stat-label">Montant rapporté (FCFA)</span>
      </div>
    </div>

    {#if summary.filleuls?.length}
      <div class="ff-card ff-card--flush">
        <div class="ff-table-wrap">
          <table class="ff-table" width="100%">
            <thead>
              <tr>
                <th>Filleul</th>
                <th>Organisation / Packs</th>
                <th>Investi (FCFA)</th>
                <th>Montant rapporté (FCFA)</th>
                <th>Commission</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {#each summary.filleuls as f}
                <tr>
                  <td>
                    <strong>{f.nom}</strong><br />
                    <small class="ff-link-muted">{f.numero}</small>
                  </td>
                  <td>{f.packs}</td>
                  <td>{f.invested ?? 0}</td>
                  <td>{f.reported ?? 0}</td>
                  <td>
                    {#if f.commission_versée}
                      <span class="text-success">Versée</span>
                    {:else}
                      <span class="text-warning">En attente</span>
                    {/if}
                  </td>
                  <td>{formatDate(f.date_creation)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {:else}
      <p>Aucun filleul pour le moment. Partagez votre lien de parrainage pour commencer.</p>
    {/if}
  {/if}
</section>
