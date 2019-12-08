<template>
  <section>
    <div class="home">
      <div class="home-header-container">
        <div class="flex space-between">
          <img class="logo-home-page" src="@/assets/logo_transparent.png" />
          <button @click="goToLogin" class="login-btn">Login</button>
        </div>
        <div class="greet flex col justify-center">
          <img class="head-home-page" src="@/assets/headTp.png" />
          <div class="flex col">
            <h1>TaskFlow lets you work</h1>
            <h1>more collaboratively </h1>
            <h1>and get more done.</h1>
          </div>
            <p>TaskFlow’s Boards, Topics, and Tasks enable
            you to organize and prioritize your
            projects in a fun, flexible, and
            rewarding way!</p>
        <button class="start-now-btn" @click="startAsGuest">Try It Now <img src="@/assets/arrow.png" class="arrow" /></button>
        </div>
      </div>

      <div class="home-productivity-container flex col ">
          <div class="prodactivity-content">
            <h1>Work with any team</h1>
            <div>
                <p>Wheter its for work,a side project
                or even the next family vacation,
                TaskFlow helps your team
                stay orgenized.</p>
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
