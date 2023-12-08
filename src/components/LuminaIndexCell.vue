<template>
    <div class="flex items-center justify-center font-semibold flex-shrink-0 w-8 h-6 border p-0.5 bg-slate-100">
        {{ index + 1 }}
    </div>
</template>

<script setup lang="ts">
defineProps<{ index: number }>();
</script>
