<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { api } from '../lib/api.js';
  import { loadUser, paymentConfigured, paymentRows, showToast, user } from '../lib/store.js';
  import IdentityCard from '../components/IdentityCard.svelte';

  let montant = '';
  let loading = false;
  let profile = null;

  onMount(async () => {
    profile = await loadUser();
    const current = profile || $user;
    const canWithdraw = current?.can_withdraw;
    if (canWithdraw === false) {
      showToast('Retrait non autorisé pour le moment.', 'error');
      push('/accueil');
    }
  });

  $: carteConfiguree = paymentConfigured(profile || $user);
  $: rows = paymentRows(profile || $user);
  $: solde = (profile || $user)?.solde ?? 0;

  async function handleSubmit(event) {
    event.preventDefault();
    loading = true;
    try {
      const data = await api.createRetrait(montant);
      await loadUser();
      showToast(data.message, 'success');
      push('/mes-retraits');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      loading = false;
    }
  }
</script>

<div class="ff-page ff-page--form">
  <div class="ff-form-card">
    <h1 class="ff-form-title">Retirer mes gains</h1>

    <div class="ff-solde-banner">
      Solde disponible : <strong>{solde} FCFA</strong>
    </div>

    <p class="ff-form-subtitle">
      Frais de retrait : 10% · Minimum : 1 000 FCFA · Multiple de 100 · 1 retrait par jour
    </p>

    {#if carteConfiguree}
      <IdentityCard
        icon="wallet"
        label="Carte de paiement enregistrée"
        {rows}
        linkUrl="#/compte"
        linkText="Modifier la carte →"
      />

      <form on:submit={handleSubmit}>
        <div class="ff-form-group">
          <label for="id_montant">Montant à retirer (FCFA)</label>
          <input
            type="number"
            id="id_montant"
            class="ff-input"
            placeholder="Ex: 5000"
            min="1000"
            step="100"
            bind:value={montant}
            required
          />
          <small class="ff-hint">Le montant doit être supérieur à 1 000 FCFA et être un multiple de 100.</small>
        </div>
        <button type="submit" class="ff-btn ff-btn-primary" disabled={loading}>
          <i class="fas fa-arrow-up"></i> {loading ? 'Traitement...' : 'Demander le retrait'}
        </button>
      </form>
    {:else}
      <div class="ff-alert ff-alert--warning">
        <i class="fas fa-exclamation-triangle"></i>
        <div>
          <strong>Carte de paiement requise</strong>
          <p>Enregistrez d'abord votre moyen de paiement (MTN, Orange Money) dans Mon compte.</p>
        </div>
      </div>
      <a href="#/compte" class="ff-btn ff-btn-primary">
        <i class="fas fa-user-cog"></i> Configurer ma carte
      </a>
    {/if}
  </div>
</div>
