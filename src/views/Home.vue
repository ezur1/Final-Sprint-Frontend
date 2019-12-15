<template>
  <section>
    <div class="home">
      <div class="home-header-container">
        <div class="top flex space-between">
          <img id="logo" class="logo-home-page" src="@/assets/logo_transparent.png" />
          <button @click="goToLogin" class="login-btn">Login</button>
        </div>
        <div class="greet flex col justify-center">
          <img class="head-img" src="@/assets/headTp.png" />
          <div class="greet-content flex col">
            <div class="flex col">
              <h1>Looking for a simple and effective way to manage your project?</h1>
            </div>
            <p>TaskFlow lets you break it up into manageable tasks and tackle them with ease!  </p>
            <button class="start-now-btn" @click="startAsGuest">Try It Now <img src="@/assets/arrow.png" class="arrow" /></button>
          </div>
        </div>
      </div>

      <div class="home-productivity-container flex col ">
          <div class="prodactivity-content flex">
            <div class="content flex col">
              <h1>Achieve more, by working together.</h1>
                  <p>Divide the workload between collaborators and easily monitor completion.</p>
            </div>
            <img class="body-home-page" src="@/assets/bodyTp.png" />
          </div>
      </div>
    </div> 

    <Footer/>

  </section>
</template>

<script>
import Footer from "../components/Footer.vue";
export default {
  name: "home",
  methods: {
    async startAsGuest() {
      const cred = {userName: "guest", password: "guest"}
      await this.$store.dispatch({type :'login', userCred:cred})
      this.$router.push('/boards/5decad6903661538bcdc8732');
    },
    goToLogin() {
      this.$router.push("/signin");
    }
  },
  components: { Footer }
};
</script>
