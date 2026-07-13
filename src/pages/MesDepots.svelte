<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';
  import { formatDate, showToast } from '../lib/store.js';
  import PageHeader from '../components/PageHeader.svelte';
  import EmptyState from '../components/EmptyState.svelte';

  let depots = [];

  onMount(async () => {
    try {
      const data = await api.getDepots();
      depots = Array.isArray(data) ? data : data.results || [];
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  function badgeClass(statut) {
    if (statut === 'validé') return 'ff-badge--success';
    if (statut === 'annulé') return 'ff-badge--error';
    return 'ff-badge--warning';
  }
</script>

<div class="ff-page">
  <PageHeader title="Mes" highlight="recharges" />

  <div class="ff-page__content">
    <div class="ff-card ff-card--flush">
      {#if depots.length}
        <div class="ff-table-wrap">
          <table class="ff-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Compte</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {#each depots as depot, index}
                <tr>
                  <td>{index + 1}</td>
                  <td>{depot.numDepot ?? 'N/A'}</td>
                  <td>{depot.montant} F</td>
                  <td>{formatDate(depot.date_creation)}</td>
                  <td>
                    <span class="ff-badge {badgeClass(depot.statut)}">{depot.statut}</span>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <EmptyState
          icon="receipt"
          message="Aucun dépôt trouvé pour ce compte."
          actionUrl="#/depot"
          actionLabel="Recharger"
        />
      {/if}
    </div>
  </div>
</div>
