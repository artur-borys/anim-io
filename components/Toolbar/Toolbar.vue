<template>
  <div class="toolbar">
    <slot />
  </div>
</template>
<style lang="scss" scoped>
.toolbar {
  @apply flex;
  position: fixed;
  top: 0.75rem;
}
</style>
