<template>
  <section class="signin-container flex justify-center align-c">
    <div v-if="isShowSignin" class="signin">
      <h1>Sign in</h1>
      <input type="text" placeholder="Username" />
      <input type="text" placeholder="password" />
      <button class="btn">Sign in</button>
    </div>
    <div v-if="isShowlogin" class="login">
      <h1>Login</h1>
      <input type="text" placeholder="Username" />
      <input type="text" placeholder="password" />
      <button class="btn">Login</button>
      <p @click="openSignin">Sign in</p>
    </div>
    
  </section>
</template>

<script>
export default {
  data() {
    return {
      isShowSignin: false,
      isShowlogin: true,
      userName: "",
      pass: ""
    };
  },
  methods: {
    openSignin() {
      this.isShowSignin = true;
      this.isShowlogin = false;
    }
  },
  components: {}
};
</script>


