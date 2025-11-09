<template>
  <div
    ref="container"
    class="flex overflow-x-auto scroll-smooth hide-scrollbar cursor-grab active:cursor-grabbing select-none"
    :class="containerClass"
    :style="containerStyle"
    @mousedown="start"
    @mouseleave="stop"
    @mouseup="stop"
    @mousemove="move"
    @wheel.prevent="onWheel"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, type CSSProperties } from "vue";

interface Props {
  containerClass?: string;
  containerStyle?: CSSProperties;
  scrollSpeed?: number;
  wheelScrollSpeed?: number;
}
const props = withDefaults(defineProps<Props>(), {
  containerClass: "",
  containerStyle: () => ({}),
  scrollSpeed: 1.5,
  wheelScrollSpeed: 2,
});

const container = ref<HTMLDivElement | null>(null);
const dragging = ref(false);
const startX = ref(0);
const scrollStart = ref(0);

function start(e: MouseEvent) {
  if (!container.value) return;
  dragging.value = true;
  startX.value = e.pageX - container.value.offsetLeft;
  scrollStart.value = container.value.scrollLeft;
}
function stop() {
  dragging.value = false;
}
function move(e: MouseEvent) {
  if (!dragging.value || !container.value) return;
  e.preventDefault();
  const x = e.pageX - container.value.offsetLeft;
  const walk = (x - startX.value) * props.scrollSpeed;
  container.value.scrollLeft = scrollStart.value - walk;
}
function onWheel(e: WheelEvent) {
  if (!container.value) return;
  container.value.scrollLeft += e.deltaY * props.wheelScrollSpeed;
}
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: thin;
  scrollbar-color: #475569 #1e293b;
}

.hide-scrollbar::-webkit-scrollbar {
  height: 4px;
}

.hide-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 9999px;
}

.hide-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to right, #475569, #1e293b);
  border-radius: 9999px;
}

.hide-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to right, #64748b, #334155);
}
</style>
