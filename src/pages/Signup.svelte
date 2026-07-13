<script>
  import { push } from 'svelte-spa-router';
  import { signup, showToast } from '../lib/store.js';

  export let params = {};

  let nom = '';
  let numero = '';
  let mdp = '';
  let cmdp = '';
  let acceptPolicy = false;
  let loading = false;
  let showMdp = false;
  let showCmdp = false;

  $: ref = params.ref || null;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!acceptPolicy) {
      showToast('Veuillez accepter la politique de confidentialité', 'warning');
      return;
    }
    loading = true;
    try {
      const data = await signup({ nom, numero, mdp, cmdp }, ref);
      showToast(data.message || 'Inscription réussie', 'success');
      push('/accueil');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      loading = false;
    }
  }
</script>

<div class="ff-page ff-page--form">
  <div class="ff-form-card">
    <h1 class="ff-form-title">Créer un compte</h1>
    <p class="ff-form-subtitle">Rejoignez Fudicia et commencez à investir</p>

    <form on:submit={handleSubmit}>
      <div class="ff-form-group">
        <label for="id_nom">Nom complet</label>
        <input type="text" id="id_nom" class="ff-input" placeholder="Votre nom complet" bind:value={nom} required />
      </div>
      <div class="ff-form-group">
        <label for="id_numero">Numéro de téléphone</label>
        <input type="text" id="id_numero" class="ff-input" placeholder="Ex: 670000000" bind:value={numero} required />
      </div>
      <div class="ff-form-group">
        <label for="id_mdp">Mot de passe</label>
        <div class="ff-input-wrap">
          {#if showMdp}
            <input type="text" id="id_mdp" class="ff-input" placeholder="Minimum 8 caractères" bind:value={mdp} required />
          {:else}
            <input type="password" id="id_mdp" class="ff-input" placeholder="Minimum 8 caractères" bind:value={mdp} required />
          {/if}
          <button type="button" class="ff-toggle-pwd" on:click={() => (showMdp = !showMdp)}>
            <i class="fas fa-{showMdp ? 'eye-slash' : 'eye'}"></i>
          </button>
        </div>
      </div>
      <div class="ff-form-group">
        <label for="id_cmdp">Confirmer le mot de passe</label>
        <div class="ff-input-wrap">
          {#if showCmdp}
            <input type="text" id="id_cmdp" class="ff-input" placeholder="Répétez le mot de passe" bind:value={cmdp} required />
          {:else}
            <input type="password" id="id_cmdp" class="ff-input" placeholder="Répétez le mot de passe" bind:value={cmdp} required />
          {/if}
          <button type="button" class="ff-toggle-pwd" on:click={() => (showCmdp = !showCmdp)}>
            <i class="fas fa-{showCmdp ? 'eye-slash' : 'eye'}"></i>
          </button>
        </div>
      </div>
      {#if ref}
        <p class="ff-hint">Code parrain : {ref}</p>
      {/if}
      <label class="ff-checkbox-row">
        <input type="checkbox" bind:checked={acceptPolicy} />
        <span>J'ai lu et j'accepte la <a href="#/politique">politique de confidentialité</a></span>
      </label>
      <button type="submit" class="ff-btn ff-btn-primary" disabled={loading || !acceptPolicy}>
        <i class="fas fa-user-plus"></i> {loading ? 'Inscription...' : "S'inscrire"}
      </button>
      <p class="ff-form-footer">
        Déjà un compte ? <a href="#/login">Se connecter</a>
      </p>
    </form>
  </div>
</div>
