<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';
  import { showToast } from '../lib/store.js';
  import { copyText, openModal, closeModal } from '../lib/utils.js';

  let dashboard = null;

  onMount(async () => {
    try {
      dashboard = await api.getDashboard();
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  async function copyReferral() {
    if (!dashboard?.parrainage_link) return;
    await copyText(dashboard.parrainage_link);
    showToast('Lien copié dans le presse-papiers !', 'success');
  }
</script>

<div class="ff-page ff-page--dashboard">
  {#if dashboard}
    <div class="ff-wallet">
      <div class="ff-wallet-user">
        <div class="ff-avatar"><i class="fas fa-user"></i></div>
        <div>
          <div class="ff-wallet-name">{dashboard.nom}</div>
          <div class="ff-wallet-phone">{dashboard.numero}</div>
        </div>
      </div>

      <div class="ff-balance-grid">
        <div class="ff-balance-item">
          <label>Solde actuel</label>
          <div class="ff-balance-value">{dashboard.solde ?? 0}</div>
          <div class="ff-balance-unit">FCFA</div>
        </div>
        <div class="ff-balance-item">
          <label>Revenu total</label>
          <div class="ff-balance-value">{dashboard.revenu ?? 0}</div>
          <div class="ff-balance-unit">FCFA</div>
        </div>
      </div>

      <div class="ff-wallet-actions">
        <a href="#/depot" class="ff-btn ff-btn-primary">
          <i class="fas fa-plus"></i> Recharger
        </a>
        <a href="#/retrait" class="ff-btn ff-btn-secondary">
          <i class="fas fa-arrow-up"></i> Retirer
        </a>
      </div>
    </div>

    <div class="ff-card">
      <p class="ff-card-title">Actions rapides</p>
      <div class="ff-actions-grid">
        <a href="#/mes-depots" class="ff-action-item">
          <div class="ff-action-icon"><img src="/static/finance/images/mesdepots.png" alt="" /></div>
          <span class="ff-action-label">Mes<br />Recharges</span>
        </a>
        <button type="button" class="ff-action-item" on:click={() => openModal('popup_parrain')}>
          <div class="ff-action-icon"><img src="/static/finance/images/group.png" alt="Inviter" /></div>
          <span class="ff-action-label">Inviter<br />Gagner</span>
        </button>
        <a href="#/packs" class="ff-action-item">
          <div class="ff-action-icon"><img src="/static/finance/images/achatpack.png" alt="" /></div>
          <span class="ff-action-label">Achat<br />Pack</span>
        </a>
        <a href="#/mes-packs" class="ff-action-item">
          <div class="ff-action-icon"><img src="/static/finance/images/mespacks.png" alt="" /></div>
          <span class="ff-action-label">Packs<br />Actifs</span>
        </a>
        <a href="#/mes-retraits" class="ff-action-item">
          <div class="ff-action-icon"><img src="/static/finance/images/mesretraits.png" alt="" /></div>
          <span class="ff-action-label">Mes<br />Retraits</span>
        </a>
        <button type="button" class="ff-action-item" on:click={() => openModal('client')}>
          <div class="ff-action-icon"><img src="/static/finance/images/client.png" alt="Service client" /></div>
          <span class="ff-action-label">Service<br />Client</span>
        </button>
      </div>
    </div>
  {/if}
</div>

<div class="ff-overlay" id="popup_parrain">
  <div class="ff-modal">
    <button type="button" class="ff-modal-close" on:click={() => closeModal('popup_parrain')} aria-label="Fermer">
      <i class="fas fa-times"></i>
    </button>
    <p class="ff-modal-title">Invitez & gagnez un bonus</p>
    <div class="ff-modal-body">
      <p>Partagez ce lien et recevez 5% de commission sur le premier achat de pack de chaque filleul.</p>
      <div class="ff-ref-link">{dashboard?.parrainage_link}</div>
    </div>
    <button type="button" class="ff-btn ff-btn-success" on:click={copyReferral}>
      <i class="fas fa-copy"></i> Copier le lien
    </button>
  </div>
</div>
