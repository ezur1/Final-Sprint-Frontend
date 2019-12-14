<template>
  <section class="flex space-between">
    <div>{{user.fullName}}</div>
    <div>
      <div @click="showConfirm=!showConfirm" class="prev-side-btn">
        <font-awesome-icon v-if="!showConfirm" class="icon" icon="trash-alt"/>
        <span class="title" v-if="!showConfirm"></span>
        <div v-if="showConfirm" class="confirm-delete flex space-between">
          <span>Are You Sure?</span>
          <div class="flex space-around">
            <font-awesome-icon class="icon" @click="removeUser(user)" icon="check" />
            <font-awesome-icon class="icon" @click="showConfirm = true" icon="times" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>

export default {
  name: "UserManagement",
  props: ["user"],
  data() {
    return {
      showConfirm: false
    };
  },
  methods: {
    removeUser(user){
      this.$emit('removeUser', user);
    },
  },
  components: {}
};
</script>