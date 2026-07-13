<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';
  import { loadUser, paymentConfigured, paymentRows, showToast, user } from '../lib/store.js';
  import IdentityCard from '../components/IdentityCard.svelte';
  import { closeModal, openModal } from '../lib/utils.js';

  let profile = null;
  let moyenPaiement = 'MTN';
  let nomBeneficiaire = '';
  let numeroPortefeuille = '';
  let saving = false;

  onMount(async () => {
    profile = await loadUser();
    if (profile) {
      moyenPaiement = profile.moyen_paiement || 'MTN';
      nomBeneficiaire = profile.nom_beneficiaire || '';
      numeroPortefeuille = profile.numero_portefeuille || '';
    }
  });

  $: current = profile || $user;
  $: paymentComplete = paymentConfigured(current);
  $: rows = paymentRows(current);

  async function savePayment() {
    saving = true;
    try {
      profile = await api.updateProfile({
        moyen_paiement: moyenPaiement,
        nom_beneficiaire: nomBeneficiaire,
        numero_portefeuille: numeroPortefeuille,
      });
      await loadUser();
      closeModal('modal_edit_payment');
      showToast('Vos informations de compte ont été mises à jour.', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      saving = false;
    }
  }
</script>

<section class="ff-panel">
  {#if current}
    <div class="ff-account-hero">
      <div class="ff-account-hero__top">
        <div class="ff-account-hero__avatar"><i class="fas fa-user"></i></div>
        <div>
          <h2 class="ff-account-hero__name">{current.nomClt || 'Votre compte'}</h2>
          <div class="ff-account-hero__meta">Numéro : {current.numero}</div>
        </div>
      </div>

      <div class="ff-account-hero__balances">
        <div class="ff-account-balance">
          <span class="ff-account-balance__label">Solde actuel</span>
          <div class="ff-account-balance__value">{current.solde ?? 0} <small>FCFA</small></div>
        </div>
        <div class="ff-account-balance">
          <span class="ff-account-balance__label">Revenu total</span>
          <div class="ff-account-balance__value">{current.revenu ?? 0} <small>FCFA</small></div>
        </div>
      </div>

      <p class="ff-section__desc">Gérez vos informations personnelles et consultez votre moyen de paiement.</p>

      <IdentityCard icon="wallet" label="Moyen de paiement" {rows} />

      <p class="ff-hint">Ces informations sont verrouillées pour des raisons de sécurité.</p>
      <div class="ff-actions" style="display:flex;gap:0.75rem;margin-top:1rem;">
        {#if !paymentComplete}
          <button type="button" class="ff-btn ff-btn-primary" on:click={() => openModal('modal_edit_payment')}>
            Mes informations
          </button>
        {:else}
          <button type="button" class="ff-btn ff-btn-secondary" disabled>Informations verrouillées</button>
        {/if}
        <a href="#/parrainage" class="ff-btn ff-btn-primary">parrainage</a>
      </div>
    </div>
  {/if}
</section>

<div class="ff-overlay" id="modal_edit_payment">
  <div class="ff-modal">
    <button type="button" class="ff-modal-close" on:click={() => closeModal('modal_edit_payment')} aria-label="Fermer">
      <i class="fas fa-times"></i>
    </button>
    <p class="ff-modal-title">Compléter vos informations de paiement</p>
    <form class="ff-form" on:submit|preventDefault={savePayment}>
      <label class="ff-field">
        <span>Moyen de paiement</span>
        <select bind:value={moyenPaiement}>
          <option value="MTN">MTN Mobile Money</option>
          <option value="ORANGE">Orange Money</option>
          <option value="BANK">Virement bancaire</option>
        </select>
      </label>
      <label class="ff-field">
        <span>Nom du bénéficiaire</span>
        <input type="text" bind:value={nomBeneficiaire} />
      </label>
      <label class="ff-field">
        <span>Numéro de portefeuille</span>
        <input type="text" bind:value={numeroPortefeuille} />
      </label>
      <div style="display:flex;gap:0.75rem;margin-top:1rem;">
        <button type="submit" class="ff-btn ff-btn-primary" disabled={saving}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button type="button" class="ff-btn ff-btn-secondary" on:click={() => closeModal('modal_edit_payment')}>
          Annuler
        </button>
      </div>
    </form>
  </div>
</div>
