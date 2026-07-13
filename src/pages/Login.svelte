<script>
  import { push } from 'svelte-spa-router';
  import { login, showToast } from '../lib/store.js';

  let numero = '';
  let mdp = '';
  let loading = false;
  let showPassword = false;

  async function handleSubmit(event) {
    event.preventDefault();
    loading = true;
    try {
      await login(numero, mdp);
      showToast('Connexion réussie', 'success');
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
    <h1 class="ff-form-title">Bon retour</h1>
    <p class="ff-form-subtitle">Connectez-vous à votre compte Fudicia</p>

    <form on:submit={handleSubmit}>
      <div class="ff-form-group">
        <label for="id_numero">Numéro de téléphone</label>
        <input
          type="text"
          id="id_numero"
          class="ff-input"
          placeholder="Ex: 670000000"
          bind:value={numero}
          required
          autocomplete="tel"
        />
      </div>
      <div class="ff-form-group">
        <label for="id_mdp">Mot de passe</label>
        <div class="ff-input-wrap">
          {#if showPassword}
            <input
              type="text"
              id="id_mdp"
              class="ff-input"
              placeholder="Votre mot de passe"
              bind:value={mdp}
              required
              autocomplete="current-password"
            />
          {:else}
            <input
              type="password"
              id="id_mdp"
              class="ff-input"
              placeholder="Votre mot de passe"
              bind:value={mdp}
              required
              autocomplete="current-password"
            />
          {/if}
          <button
            type="button"
            class="ff-toggle-pwd"
            aria-label="Afficher le mot de passe"
            on:click={() => (showPassword = !showPassword)}
          >
            <i class="fas fa-{showPassword ? 'eye-slash' : 'eye'}"></i>
          </button>
        </div>
      </div>
      <button type="submit" class="ff-btn ff-btn-primary ff-mt-4" disabled={loading}>
        <i class="fas fa-sign-in-alt"></i> {loading ? 'Connexion...' : 'Se connecter'}
      </button>
      <p class="ff-form-footer">
        Pas encore de compte ? <a href="#/signup">Créer un compte</a>
      </p>
    </form>
  </div>
</div>
