<template>
  <section class="tasks">
    <h3>{{}}</h3>
    <div v-if="isTaskBtns" class="descBtns">
      <button>Save</button>
      <button>X</button>
    </div>
  </section>
</template>

<script>
export default {
};
</script>