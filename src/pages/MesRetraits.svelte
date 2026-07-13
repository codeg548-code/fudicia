<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';
  import { formatDate, showToast } from '../lib/store.js';
  import PageHeader from '../components/PageHeader.svelte';
  import EmptyState from '../components/EmptyState.svelte';

  let retraits = [];

  onMount(async () => {
    try {
      const data = await api.getRetraits();
      retraits = Array.isArray(data) ? data : data.results || [];
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
  <PageHeader title="Mes" highlight="retraits" />

  <div class="ff-page__content">
    <div class="ff-card ff-card--flush">
      {#if retraits.length}
        <div class="ff-table-wrap">
          <table class="ff-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {#each retraits as retrait, index}
                <tr>
                  <td>{index + 1}</td>
                  <td>{retrait.montant} F</td>
                  <td>{formatDate(retrait.date_creation)}</td>
                  <td>
                    <span class="ff-badge {badgeClass(retrait.statut)}">{retrait.statut}</span>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <EmptyState
          icon="money-bill-alt"
          message="Aucun retrait trouvé pour ce compte."
          actionUrl="#/retrait"
          actionLabel="Retirer"
        />
      {/if}
    </div>
  </div>
</div>
