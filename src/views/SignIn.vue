<template>
  <section class="signin-container flex justify-center align-c">
    <div v-if="isShowSignin" class="signin">
      <h1>Sign Up</h1>
      <input type="text" placeholder="Username" />
      <input type="text" placeholder="password" />
      <button class="btn">Sign Up</button>
      <p @click="openLogIn">Log In</p>
    </div>
    <div v-if="isShowlogin" class="login">
      <h1>Login</h1>
      <input type="text" placeholder="Username" />
      <input type="text" placeholder="password" />
      <button class="btn">Login</button>
      <p @click="openSignUp">Sign Up</p>
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
    openSignUp() {
      this.isShowSignin = true;
      this.isShowlogin = false;
    },
    openLogIn() {
      this.isShowSignin = false;
      this.isShowlogin = true;
    }
  },
  components: {}
};
</script>


