<script>
  export let icon = 'box-open';
  export let message = '';
  export let actionUrl = '';
  export let actionLabel = '';
</script>

<div class="ff-empty-state">
  <div class="ff-empty-state__icon"><i class="fas fa-{icon}"></i></div>
  <p>{message}</p>
  {#if actionUrl}
    <a href={actionUrl} class="ff-btn ff-btn-primary">{actionLabel}</a>
  {/if}
</div>
