<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';
  import { formatDate, showToast } from '../lib/store.js';
  import PageHeader from '../components/PageHeader.svelte';
  import EmptyState from '../components/EmptyState.svelte';

  let packs = [];

  onMount(async () => {
    try {
      packs = await api.getMesPacks();
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
</script>

<div class="ff-page">
  <PageHeader title="Packs" highlight="actifs" />

  <div class="ff-page__content">
    <div class="ff-pack-list">
      {#each packs as pack}
        <article class="ff-pack-card ff-pack-card--active">
          <div class="ff-pack-img"></div>
          <div class="ff-pack-info">
            <div class="ff-pack-card__header">
              <div>
                <h3 class="ff-pack-title">{pack.nom_pack}</h3>
                <p class="ff-pack-subtitle">Pack en cours de suivi</p>
              </div>
              <span
                class="ff-badge"
                class:ff-badge--success={pack.statut === 'Actif'}
                class:ff-badge--warning={pack.statut !== 'Actif'}
              >
                {pack.statut}
              </span>
            </div>

            <div class="ff-pack-metrics">
              <div class="ff-pack-metric">
                <span class="ff-pack-metric__label">Investi</span>
                <strong class="ff-pack-metric__value">{pack.montant_investi} F</strong>
              </div>
              <div class="ff-pack-metric">
                <span class="ff-pack-metric__label">Profit total</span>
                <strong class="ff-pack-metric__value">{pack.montant_total_profit} F</strong>
              </div>
              <div class="ff-pack-metric">
                <span class="ff-pack-metric__label">Date d'achat</span>
                <strong class="ff-pack-metric__value">{formatDate(pack.date_achat)}</strong>
              </div>
              <div class="ff-pack-metric">
                <span class="ff-pack-metric__label">Échéance</span>
                <strong class="ff-pack-metric__value">{formatDate(pack.date_expiration)}</strong>
              </div>
            </div>

            <div class="ff-pack-footer">
              <p class="ff-pack-status">{pack.temps_affichage}</p>
            </div>
          </div>
        </article>
      {:else}
        <EmptyState
          icon="box-open"
          message="Aucun pack actif pour le moment."
          actionUrl="#/packs"
          actionLabel="Voir les packs"
        />
      {/each}
    </div>
  </div>
</div>
