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

.toolbar-item {
  @apply p-2;
  @apply border-t;
  @apply border-b;
  @apply border-gray-500;
  @apply bg-white;
  box-sizing: border-box;
  font-size: 1.25rem;

  &:first-child {
    @apply rounded-l-full;
    @apply border-l;
    @apply pl-4;
  }

  &:last-child {
    @apply rounded-r-full;
    @apply border-r;
    @apply pr-4;
  }

  &.disabled {
    @apply text-gray-500;
    cursor: not-allowed;
  }

  &:not(.disabled):hover {
    @apply bg-gray-200;
    cursor: pointer;
    @apply text-blue-500;
  }

  &.active {
    @apply text-blue-500;
  }
}
</style>
