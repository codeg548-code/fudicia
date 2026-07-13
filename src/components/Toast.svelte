<script>
  import { toasts, dismissToast } from '../lib/store.js';

  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle',
  };
</script>

<div class="ff-toast-container" role="status" aria-live="polite">
  {#each $toasts as toast (toast.id)}
    <div class="ff-toast ff-toast--{toast.type}">
      <i class="fas fa-{icons[toast.type] || 'info-circle'}"></i>
      <span>{toast.message}</span>
      <button class="ff-toast-close" aria-label="Fermer" on:click={() => dismissToast(toast.id)}>&times;</button>
    </div>
  {/each}
</div>
