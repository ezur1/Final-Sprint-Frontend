<template>
  <section class="signin-container flex justify-center align-c">
    <div v-if="isShowSignUp" class="signup">
      <h1>Sign Up</h1>
      <input type="text" placeholder="Username" v-model="userSignUpDetails.userName" />
      <input type="text" placeholder="Full Name" v-model="userSignUpDetails.fullName" />
      <input type="password" placeholder="Password" v-model="userSignUpDetails.password" @keyup.enter="doSignup" />
      <button class="btn flex justify-center align-c" @click="doSignup">
        Sign Up
        <div v-if="isPleaseWait" class="loading"><div></div><div></div><div></div><div></div></div>
      </button>
      <p class="underline" @click="openLogIn">Log In</p>
    </div>
    <div v-if="isShowlogin" class="login">
      <!-- <h1>Login</h1> -->
      <input type="text" placeholder="Username" v-model="userCred.userName" />
      <input type="password" placeholder="password" v-model="userCred.password" @keyup.enter="doLogin"/>
      <button class="btn flex justify-center align-c" @click="doLogin">
        Login
        <div v-if="isPleaseWait" class="loading"><div></div><div></div><div></div><div></div></div>
        </button>
      <p class="underline" @click="openSignUp">Sign Up</p>
    </div>
    <img id="logo" class="login-page-img" src="@/assets/login.png" />
  </section>
</template>

<script>
export default {
  data() {
    return {
      isShowSignUp: false,
      isShowlogin: true,
      userCred: { userName: null, password: null },
      userSignUpDetails: { userName: null, fullName: null, password: null },
      isPleaseWait: false
    };
  },
  methods: {
    openSignUp() {
      this.isShowSignUp = true;
      this.isShowlogin = false;
      this.userSignUpDetails = {};
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
      this.isPleaseWait = true;
      await this.$store.dispatch({ type: "login", userCred: cred })
      this.isPleaseWait = false;
      this.$router.push("/taskfloapp");

    },
    async doSignup() {
      const cred = this.userSignUpDetails;
      if (!cred.userName || !cred.password) return (this.msg = "Please enter user/password");
      this.userSignUpDetails = {};
      this.isPleaseWait = true;
      await this.$store.dispatch({ type: "signup", userCred: cred })
      this.isPleaseWait = false;
      this.$router.push("/boards/5de684f15564fb54d8768cff");
    }
  },
  components: {}
};
</script>


