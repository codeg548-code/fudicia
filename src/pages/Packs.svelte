<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';
  import { showToast } from '../lib/store.js';
  import PageHeader from '../components/PageHeader.svelte';
  import EmptyState from '../components/EmptyState.svelte';

  let packs = [];

  onMount(async () => {
    try {
      packs = await api.getPacksEnriched();
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  function stockWidth(pack) {
    if (!pack.stock_initial) return 0;
    return Math.round(((pack.stock_disponible || 0) / pack.stock_initial) * 100);
  }
</script>

<div class="ff-page">
  <PageHeader
    title="Packs"
    highlight="disponibles"
    subtitle="Stock limité — disponibilité en temps réel."
  />

  <div class="ff-page__content">
    <div class="ff-pack-list">
      {#each packs as pack}
        <article class="ff-pack-card" class:ff-pack-card--disabled={!pack.peut_acheter}>
          <div class="ff-pack-img">
            <h3>{pack.nomPack}</h3>
          </div>
          <div class="ff-pack-info">
            <div class="ff-pack-name-row">
              <strong>{pack.nomPack}</strong>
              {#if pack.deja_achete}
                <span class="ff-badge ff-badge--success">Acheté</span>
              {:else if !pack.est_en_stock}
                <span class="ff-badge ff-badge--error">Épuisé</span>
              {/if}
            </div>
            <div>Prix : <strong>{pack.montant} F</strong></div>
            <div>Revenu : <strong>{pack.gainJr} F/jr</strong></div>
            <div>Durée : <strong>{pack.duree} jours</strong></div>
            <div class="ff-pack-stock">
              <span
                >Disponibles : <strong>{pack.stock_disponible ?? '—'}</strong> /
                <strong>{pack.stock_initial ?? '—'}</strong></span
              >
              <span class="ff-stock-bar" aria-hidden="true">
                <span class="ff-stock-bar__fill" style="width: {stockWidth(pack)}%"></span>
              </span>
            </div>
            {#if pack.message_blocage}
              <p class="ff-pack-notice">{pack.message_blocage}</p>
            {/if}
          </div>
          <div class="ff-pack-buy">
            {#if pack.peut_acheter}
              <a href="#/buy-pack/{pack.codePack}" aria-label="Acheter {pack.nomPack}">
                <img src="/static/finance/images/acheterpack.png" alt="Acheter" />
              </a>
            {:else}
              <span class="ff-pack-buy--disabled" aria-hidden="true"><i class="fas fa-lock"></i></span>
            {/if}
          </div>
        </article>
      {:else}
        <EmptyState icon="box-open" message="Aucun pack d'investissement disponible pour le moment." />
      {/each}
    </div>
  </div>
</div>
