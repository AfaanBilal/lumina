<template>
    <div class="flex items-center justify-center font-semibold w-6 h-6 border p-0.5 bg-slate-100">
        {{ index + 1 }}
    </div>
</template>

<script setup lang="ts">
defineProps<{ index: number }>();
</script>
