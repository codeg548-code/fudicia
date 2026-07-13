<script>
  import { onMount } from 'svelte';
  import Router, { push, location } from 'svelte-spa-router';
  import { wrap } from 'svelte-spa-router/wrap';
  import Toast from './components/Toast.svelte';
  import { user, loadUser, logout } from './lib/store.js';
  import { openModal, closeModal } from './lib/utils.js';

  import Login from './pages/Login.svelte';
  import Signup from './pages/Signup.svelte';
  import Accueil from './pages/Accueil.svelte';
  import Packs from './pages/Packs.svelte';
  import BuyPack from './pages/BuyPack.svelte';
  import Depot from './pages/Depot.svelte';
  import Retrait from './pages/Retrait.svelte';
  import MesDepots from './pages/MesDepots.svelte';
  import MesRetraits from './pages/MesRetraits.svelte';
  import MesPacks from './pages/MesPacks.svelte';
  import Compte from './pages/Compte.svelte';
  import Parrainage from './pages/Parrainage.svelte';
  import Politique from './pages/Politique.svelte';

  const authRoutes = new Set([
    '/accueil',
    '/packs',
    '/depot',
    '/retrait',
    '/mes-depots',
    '/mes-retraits',
    '/mes-packs',
    '/compte',
    '/parrainage',
  ]);

  const guard = (component) =>
    wrap({
      component,
      conditions: [() => Boolean($user)],
      userData: { requiresAuth: true },
    });

  const guestGuard = (component) =>
    wrap({
      component,
      conditions: [() => !$user],
      userData: { guestOnly: true },
    });

  const routes = {
    '/': guestGuard(Login),
    '/login': guestGuard(Login),
    '/signup': guestGuard(Signup),
    '/signup/:ref': guestGuard(Signup),
    '/accueil': guard(Accueil),
    '/packs': guard(Packs),
    '/buy-pack/:packId': guard(BuyPack),
    '/depot': guard(Depot),
    '/retrait': guard(Retrait),
    '/mes-depots': guard(MesDepots),
    '/mes-retraits': guard(MesRetraits),
    '/mes-packs': guard(MesPacks),
    '/compte': guard(Compte),
    '/parrainage': guard(Parrainage),
    '/politique': Politique,
  };

  let drawerOpen = false;
  let ready = false;

  onMount(async () => {
    await loadUser();
    ready = true;
    if (!$user && authRoutes.has($location) && !$location.startsWith('/buy-pack')) {
      push('/login');
    }
    if ($user && ($location === '/' || $location === '/login')) {
      push('/accueil');
    }
  });

  $: if (ready) {
    if (!$user && authRoutes.has($location)) {
      push('/login');
    }
    if ($user && ($location === '/' || $location === '/login' || $location === '/signup' || $location.startsWith('/signup/'))) {
      push('/accueil');
    }
  }

  function toggleDrawer() {
    drawerOpen = !drawerOpen;
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
  }

  function closeDrawer() {
    drawerOpen = false;
    document.body.style.overflow = '';
  }

  async function handleLogout() {
    await logout();
    closeDrawer();
    push('/login');
  }

  function isActive(path) {
    if (path === '/packs') {
      return $location === '/packs' || $location.startsWith('/buy-pack');
    }
    return $location === path;
  }
</script>

<div class="ff-app">
  <header class="ff-header">
    <a href="#/{$user ? 'accueil' : 'login'}" class="ff-logo" aria-label="Fudicia — Accueil">
      <span class="ff-logo-icon"><i class="fas fa-chart-line"></i></span>
      <span class="ff-logo-text">Fudicia</span>
    </a>
    {#if $user}
      <button class="ff-header-btn" aria-label="Menu compte et historique" on:click={toggleDrawer}>
        <i class="fas fa-ellipsis-v"></i>
      </button>
    {:else}
      <a href="#/login" class="ff-header-btn" aria-label="Se connecter">
        <i class="fas fa-sign-in-alt"></i>
      </a>
    {/if}
  </header>

  <Toast />

  <main class="ff-main" class:ff-main--auth={!$user}>
    {#if ready}
      <Router {routes} />
    {/if}
  </main>

  {#if $user}
    <nav class="ff-bottom-nav" aria-label="Navigation principale">
      <a href="#/accueil" class="ff-nav-item" class:active={isActive('/accueil')}>
        <span class="ff-nav-icon"><i class="fas fa-home"></i></span>
        <span class="ff-nav-label">Accueil</span>
      </a>
      <a href="#/packs" class="ff-nav-item" class:active={isActive('/packs')}>
        <span class="ff-nav-icon"><i class="fas fa-box"></i></span>
        <span class="ff-nav-label">Packs</span>
      </a>
      <a href="#/depot" class="ff-nav-item ff-nav-item--center" class:active={isActive('/depot')}>
        <span class="ff-nav-icon ff-nav-icon--center"><i class="fas fa-plus"></i></span>
        <span class="ff-nav-label">Recharge</span>
      </a>
      <a href="#/parrainage" class="ff-nav-item" class:active={isActive('/parrainage')}>
        <span class="ff-nav-icon"><i class="fas fa-handshake"></i></span>
        <span class="ff-nav-label">Parrainage</span>
      </a>
      <a href="#/compte" class="ff-nav-item" class:active={isActive('/compte')}>
        <span class="ff-nav-icon"><i class="fas fa-user"></i></span>
        <span class="ff-nav-label">Compte</span>
      </a>
    </nav>

    <div class="ff-drawer-overlay" class:active={drawerOpen} on:click={closeDrawer} role="presentation"></div>
    <aside class="ff-drawer" class:active={drawerOpen} aria-label="Menu historique">
      <button class="ff-modal-close" aria-label="Fermer" on:click={closeDrawer}><i class="fas fa-times"></i></button>
      <p class="ff-drawer-title">Compte & Historique</p>
      <a href="#/mes-depots" class="ff-drawer-link" on:click={closeDrawer}>
        <i class="fas fa-receipt"></i> Mes recharges
      </a>
      <a href="#/mes-retraits" class="ff-drawer-link" on:click={closeDrawer}>
        <i class="fas fa-money-bill-alt"></i> Mes retraits
      </a>
      <a href="#/mes-packs" class="ff-drawer-link" on:click={closeDrawer}>
        <i class="fas fa-box-open"></i> Packs actifs
      </a>
      <a href="#/compte" class="ff-drawer-link" on:click={closeDrawer}>
        <i class="fas fa-user-cog"></i> Mon compte
      </a>
      <a href="#/parrainage" class="ff-drawer-link" on:click={closeDrawer}>
        <i class="fas fa-handshake"></i> Parrainage
      </a>
      <a href="#/politique" class="ff-drawer-link" on:click={closeDrawer}>
        <i class="fas fa-shield-alt"></i> Politique de confidentialité
      </a>
      <button type="button" class="ff-drawer-link ff-drawer-link--danger" on:click={handleLogout}>
        <i class="fas fa-sign-out-alt"></i> Déconnexion
      </button>
    </aside>

    <button class="ff-float-btn" aria-label="Service client" on:click={() => openModal('client')}>
      <span class="ff-float-icon"><i class="fas fa-headset"></i></span>
      <span class="ff-float-label">Service client</span>
    </button>

    <div class="ff-overlay" id="client">
      <div class="ff-modal">
        <button type="button" class="ff-modal-close" on:click={() => closeModal('client')} aria-label="Fermer">
          <i class="fas fa-times"></i>
        </button>
        <p class="ff-modal-title">Contactez le service client</p>
        <div class="ff-service-grid">
          <a href="https://t.me/672870153" target="_blank" rel="noopener">
            <img src="/static/finance/images/telegram.jpg" alt="Telegram" />
          </a>
          <a href="https://wa.me/672870153" target="_blank" rel="noopener">
            <img src="/static/finance/images/whatsapp.jpg" alt="WhatsApp" />
          </a>
        </div>
      </div>
    </div>
  {/if}
</div>
