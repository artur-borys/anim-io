<template>
  <div class="toolbar-item" :class="{ active: active, disabled: disabled }">
    <div class="toolbar-item-link" @click="onClick">
      <slot />
      <div v-if="dropdown" class="dropdown-icon"><chevron-down-icon /></div>
    </div>
    <div
      v-show="dropdown"
      ref="dropdown"
      class="toolbar-item-dropdown"
      @click="dropdownClick"
    >
      <div v-show="expanded" class="toolbar-item-dropdown-content">
        <slot name="dropdown" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    dropdown: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expanded: false,
    }
  },
  watch: {
    active(val, oldVal) {
      if (!val) {
        this.expanded = false
      }
    },
    expanded(val) {
      if (!val) {
        this.$emit('collapse')
        document.removeEventListener('click', this.outsideClickListener)
      } else {
        const { top } = this.$el.getBoundingClientRect()
        // const linkCenter = this.$el.offsetWidth / 2
        const { offsetHeight } = this.$el
        console.log(this.$refs.dropdown.offsetWidth)
        this.$refs.dropdown.style.top = `${top + offsetHeight + 12}px`
        // this.$refs.dropdown.style.left = `${
        //   left + linkCenter - this.$refs.dropdown.offsetWidth / 2
        // }px`
        this.$emit('expand')
        document.addEventListener('click', this.outsideClickListener)
      }
    },
  },
  methods: {
    onClick(e) {
      e.stopPropagation()
      if (this.active && this.dropdown) {
        this.expanded = !this.expanded
      } else {
        this.$emit('click')
      }
    },
    dropdownClick(e) {
      e.stopPropagation()
    },
    outsideClickListener() {
      if (this.expanded) {
        this.expanded = false
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.toolbar-item {
  .toolbar-item-link {
    @apply p-2;
    @apply border-t;
    @apply border-b;
    @apply border-gray-500;
    @apply bg-white;
    box-sizing: border-box;
    font-size: 1.25rem;
    position: relative;

    .dropdown-icon {
      position: absolute;
      bottom: 0;
      left: 0;
      color: #000;
      font-size: 0.75rem;
      text-align: center;
      width: 100%;
    }
  }

  &:first-child .toolbar-item-link {
    @apply rounded-l-full;
    @apply border-l;
    @apply pl-4;
  }

  &:last-child .toolbar-item-link {
    @apply rounded-r-full;
    @apply border-r;
    @apply pr-4;
  }

  &.disabled .toolbar-item-link {
    @apply text-gray-500;
    cursor: not-allowed;
  }

  &:not(.disabled) .toolbar-item-link:hover {
    @apply bg-gray-200;
    cursor: pointer;
    @apply text-blue-500;
  }

  &.active .toolbar-item-link {
    @apply text-blue-500;
  }
}

.toolbar-item-dropdown {
  @apply bg-white;
  @apply fixed;
  @apply text-base;
  @apply text-black;
  @apply shadow;
  @apply rounded;
  transform: translateX(-50%);

  .toolbar-item-dropdown-content {
    @apply p-3;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      width: 0;
      transform: translateX(-50%);
      border-bottom: 12px solid white;
      border-left: 12px solid transparent;
      border-right: 12px solid transparent;
    }
  }
}
</style>
