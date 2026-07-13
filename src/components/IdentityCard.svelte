<script>
  export let icon = 'wallet';
  export let label = '';
  export let rows = [];
  export let linkUrl = '';
  export let linkText = '';
</script>

<div class="ff-identity-card">
  <div class="ff-identity-card__head">
    <span class="ff-identity-card__icon"><i class="fas fa-{icon}"></i></span>
    <span class="ff-identity-card__label">{label}</span>
  </div>
  <dl class="ff-identity-card__rows">
    {#each rows as row}
      <div class="ff-identity-card__row">
        <dt>{row.label}</dt>
        <dd>{row.value}</dd>
      </div>
    {/each}
  </dl>
  {#if linkUrl}
    <a href={linkUrl} class="ff-identity-card__link">{linkText}</a>
  {/if}
</div>
