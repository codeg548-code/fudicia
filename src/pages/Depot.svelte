<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';
  import { loadUser, showToast } from '../lib/store.js';

  let montant = '';
  let idtransaction = '';
  let moyenPaiement = ''; // 'MTN' ou 'ORANGE'
  let loading = false;
  let configurationsPaiement = {}; // Chargé dynamiquement depuis le backend

  onMount(async () => {
    try {
      configurationsPaiement = await api.getDepotConfigs();
    } catch (error) {
      showToast("Impossible de récupérer les instructions de paiement.", 'error');
    }
  });

  async function handleSubmit(event) {
    event.preventDefault();
    
    if (!moyenPaiement) {
      showToast('Veuillez sélectionner un réseau de paiement.', 'error');
      return;
    }

    loading = true;
    try {
      // Payload structuré envoyé à l'API Django
      await api.createDepot({
        montant_str: montant,
        idtransaction: idtransaction,
        moyen_paiement: moyenPaiement
      });
      
      await loadUser();
      showToast('Votre dépôt a été soumis pour validation avec succès.', 'success');
      
      // Reset
      montant = '';
      idtransaction = '';
      moyenPaiement = '';
    } catch (error) {
      showToast(error.message || 'Une erreur est survenue.', 'error');
    } finally {
      loading = false;
    }
  }
</script>

<div class="ff-page ff-page--form">
  <div class="ff-form-card">
    <h1 class="ff-form-title">Recharger mon compte</h1>
    <p class="ff-form-subtitle">Suivez les instructions pour effectuer votre transfert.</p>

    <div class="ff-step-section">
      <h2 class="ff-step-title">1. Choisir le réseau de paiement</h2>
      <div class="ff-provider-grid">
        <button 
          type="button" 
          class="ff-provider-btn {moyenPaiement === 'MTN' ? 'active-mtn' : ''}" 
          on:click={() => moyenPaiement = 'MTN'}
        >
          <span>MTN Mobile Money</span>
        </button>
        <button 
          type="button" 
          class="ff-provider-btn {moyenPaiement === 'ORANGE' ? 'active-orange' : ''}" 
          on:click={() => moyenPaiement = 'ORANGE'}
        >
          <span>Orange Money</span>
        </button>
      </div>

      {#if moyenPaiement && configurationsPaiement[moyenPaiement]}
        <div class="ff-instruction-card {moyenPaiement === 'MTN' ? 'ff-provider--mtn' : 'ff-provider--orange'}">
          <h3>Instructions de transfert :</h3>
          <p>Faites le transfert de fonds vers les coordonnées ci-dessous avant de remplir le formulaire.</p>
          <hr />
          <div class="ff-instruction-row">
            <strong>Numéro destinataire :</strong> <span class="ff-copy-code">{configurationsPaiement[moyenPaiement].numero}</span>
          </div>
          <div class="ff-instruction-row">
            <strong>Nom du compte :</strong> {configurationsPaiement[moyenPaiement].nom}
          </div>
          <div class="ff-instruction-row">
            <small><strong>Code USSD :</strong> {configurationsPaiement[moyenPaiement].syntaxe}</small>
          </div>
        </div>
      {:else if moyenPaiement}
        <p class="ff-hint text-warning">Mode de paiement temporairement indisponible.</p>
      {/if}
    </div>

    <div class="ff-step-section mt-4">
      <h2 class="ff-step-title">2. Déclarer le dépôt</h2>
      
      <form on:submit={handleSubmit}>
        <div class="ff-form-group">
          <label for="id_montant">Montant envoyé (FCFA) *</label>
          <input
            type="number"
            id="id_montant"
            class="ff-input"
            placeholder="minimum: 2500"
            min="2500"
            bind:value={montant}
            required
          />
        </div>

        <div class="ff-form-group">
          <label for="id_transaction">ID de Transaction / Référence SMS *</label>
          <input
            type="text"
            id="id_transaction"
            class="ff-input"
            placeholder="Entrez la référence exacte du transfert"
            bind:value={idtransaction}
            required
          />
          <small class="ff-hint ff-hint--danger">Un identifiant exact accélère le traitement de votre dépôt.</small>
        </div>

        <button 
          type="submit" 
          class="ff-btn ff-btn-success" 
          disabled={loading || !moyenPaiement || !configurationsPaiement[moyenPaiement]}
        >
          <i class="fas fa-paper-plane"></i> {loading ? 'Envoi...' : 'Soumettre le dépôt'}
        </button>
      </form>
    </div>
  </div>
</div>

<style>
  .ff-step-section { margin-bottom: 1.5rem; }
  .ff-step-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.75rem; color: #333; }
  .ff-provider-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
  .ff-provider-btn { padding: 0.75rem; border: 2px solid #e2e8f0; background: #fff; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.2s; }
  
  .active-mtn { border-color: #ffcc00; background-color: #fffdf0; color: #b38f00; }
  .active-orange { border-color: #ff6600; background-color: #fff6f0; color: #cc5200; }
  
  .ff-instruction-card { padding: 1rem; border-radius: 8px; margin-top: 0.5rem; font-size: 0.9rem; }
  .ff-provider--mtn { background-color: #fffdf0; border-left: 4px solid #ffcc00; }
  .ff-provider--orange { background-color: #fff6f0; border-left: 4px solid #ff6600; }
  
  .ff-instruction-row { margin-bottom: 0.4rem; }
  .ff-copy-code { background: #edf2f7; padding: 0.2rem 0.5rem; border-radius: 4px; font-family: monospace; font-size: 1rem; font-weight: bold; }
  .ff-hint--danger { color: #e53e3e; }
  
  .ff-btn-success { background-color: #38a169; color: white; width: 100%; padding: 0.75rem; border-radius: 6px; font-weight: bold; border: none; cursor: pointer; }
  .ff-btn-success:disabled { background-color: #cbd5e0; cursor: not-allowed; }
</style>