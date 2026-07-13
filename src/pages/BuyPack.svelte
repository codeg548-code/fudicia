<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { api } from '../lib/api.js';
  import { loadUser, showToast } from '../lib/store.js';

  export let params = {};

  let preview = null;
  let loading = false;

  onMount(async () => {
    try {
      preview = await api.getBuyPreview(params.packId);
    } catch (error) {
      showToast(error.message, 'error');
      push('/packs');
    }
  });

  async function confirmBuy() {
    loading = true;
    try {
      const data = await api.buyPack(params.packId);
      await loadUser();
      showToast(data.message, 'success');
      push('/mes-packs');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      loading = false;
    }
  }
</script>

<div class="ff-page ff-page--form">
  <div class="ff-form-card">
    <h1 class="ff-form-title">Confirmer l'investissement</h1>
    <p class="ff-form-subtitle">Voulez-vous investir dans ce pack ?</p>

    {#if preview}
      {#if !preview.peut_acheter}
        <div class="ff-alert ff-alert--warning">
          <i class="fas fa-exclamation-triangle"></i>
          <div><strong>Achat impossible</strong><p>{preview.message_blocage}</p></div>
        </div>
        <a href="#/packs" class="ff-btn ff-btn-secondary">Retour aux packs</a>
      {:else}
        <ul class="ff-confirm-list">
          <li><span>Pack</span><span>{preview.pack.nomPack}</span></li>
          <li><span>Investissement</span><span>{preview.pack.montant} F</span></li>
          <li><span>Gain journalier</span><span>{preview.pack.gainJr} F</span></li>
          <li><span>Durée</span><span>{preview.pack.duree} jours</span></li>
          <li><span>Stock restant</span><span>{preview.pack.stock_disponible ?? '—'} / {preview.pack.stock_initial ?? '—'}</span></li>
          <li><span>Votre solde</span><span>{preview.client_solde} F</span></li>
        </ul>
        <div class="ff-confirm-actions">
          <a href="#/packs" class="ff-btn ff-btn-secondary">Annuler</a>
          <button type="button" class="ff-btn ff-btn-primary" on:click={confirmBuy} disabled={loading}>
            <i class="fas fa-check"></i> {loading ? 'Traitement...' : 'Confirmer'}
          </button>
        </div>
      {/if}
    {/if}
  </div>
</div>
