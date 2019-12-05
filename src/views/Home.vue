<template>
  <section>
    <div class="home">
      <div class="home-header-container">
        <div class="flex space-between">
          <img class="logo-home-page" src="@/assets/logo_transparent.png" />
          <button @click="goToLogin" class="login-btn">Login</button>
        </div>
        <div class="greet flex col justify-center space-around">
          <div class="flex col">
            <h1>TaskFlow lets you</h1>
            <h1>work more collaboratively </h1>
            <h1>and get more done.</h1>
          </div>
            <p>TaskFlow’s boards, lists, and cards enable
            you to organize and prioritize your
            projects in a fun, flexible, and
            rewarding way!</p>
        </div>
        
        <button class="start-now-btn" @click="startAsGuest">Try It Now <img src="@/assets/arrow.png" class="arrow" /></button>
      </div>

      <div class="productivity flex space-around">
        <img src="@/assets/img/productivity-hero.jpg" alt />
        <div class="txt flex col">
          <h2>A Productivity Platform</h2>

          <p>Integrate the apps your team already uses directly into your workflow.</p>
          <p>Power-Ups turn Trello boards into living applications to meet your team's unique business needs.</p>
        </div>
      </div>

      <div class="team-work flex space-around">
        <div class="txt flex col">
          <h2>Team work</h2>
          <p>It’s easy to get your team up and running with webflo.</p>
          <p>We’ve collected all of the boards and tools you need to succeed in one handy resource.</p>
        </div>
        <img src="@/assets/img/team-work-hero.jpg" alt />
      </div>

      <div class="time-management flex space-around">
        <img src="@/assets/img/team performance.jpg" alt />
        <div class="txt flex col">
          <h2>Optimize team performance</h2>
          <p>Wrike’s flexible resource allocation allows project managers to distribute work hours</p>
          <p>to best suit each team member’s strengths and availability. Enable your team to work</p>
          <p>collaboratively and avoid project delays due to unbalanced workloads.</p>
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
      this.$router.push('/boards/5de684f15564fb54d8768cff');
      // this.$router.push('/boards/3b44c9c13368cbfb8f1bf4b4');
    },
    goToLogin() {
      this.$router.push("/signin");
    }
  },
  components: { Footer }
};
</script>
