<template>
  <section class="signin-container flex justify-center align-c">
    <div v-if="isShowSignUp" class="signin">
      <h1>Sign Up</h1>
      <input type="text" placeholder="Username" v-model="userCred.userName" />
      <input type="password" placeholder="password" v-model="userCred.password" @keyup.enter="doSignup" />
      <button class="btn" @click="doSignup">Sign Up</button>
      <p @click="openLogIn">Log In</p>
    </div>
    <div v-if="isShowlogin" class="login">
      <h1>Login</h1>
      <input type="text" placeholder="Username" v-model="userCred.userName" />
      <input type="password" placeholder="password" v-model="userCred.password" @keyup.enter="doLogin"/>
      <button class="btn" @click="doLogin">Login</button>
      <p @click="openSignUp">Sign Up</p>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isShowSignUp: false,
      isShowlogin: true,
      userCred: { userName: null, password: null }
    };
  },
  methods: {
    openSignUp() {
      this.isShowSignUp = true;
      this.isShowlogin = false;
      this.userCred = {};
    },
    openLogIn() {
      this.isShowSignUp = false;
      this.isShowlogin = true;
      this.userCred = {};
    },
    async doLogin() {
      const cred = this.userCred;
      if (!cred.userName || !cred.password) return (this.msg = "Please enter user/password");
      this.userCred = {};
      await this.$store.dispatch({ type: "login", userCred: cred })
      this.$router.push("/taskfloapp");

    },
    async doSignup() {
      const cred = this.userCred;
      if (!cred.userName || !cred.password) return (this.msg = "Please enter user/password");
      this.userCred = {};
      await this.$store.dispatch({ type: "signup", userCred: cred })
        ////// this actually needs to lead to an empty board !
        this.$router.push("/boards/5de684f15564fb54d8768cff");
    }
  },
  components: {}
};
</script>


