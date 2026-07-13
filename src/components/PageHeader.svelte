<script>
  export let title = '';
  export let highlight = '';
  export let subtitle = '';
</script>

<header class="ff-page-header">
  <h1 class="ff-page-header__title">
    {title}
    {#if highlight}<span class="ff-page-header__highlight">{highlight}</span>{/if}
  </h1>
  {#if subtitle}
    <p class="ff-page-header__subtitle">{subtitle}</p>
  {/if}
</header>
