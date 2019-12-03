<template>
  <div class="home">
    <div class="home-header-container">
      <div class="flex space-between">
        <img class="logo-home-page" src="@/assets/logo_transparent.png" />
        <button @click="goToLogin" class="login-btn">Login</button>
      </div>
      <div class="greet flex justify-center space-around">
        <div>
          <h1>TaskFlo lets you work more</h1>
          <h1>collaboratively and get more done.</h1>
          <p>TaskFlo’s boards, lists, and cards enable</p>
          <p>you to organize and prioritize your</p>
          <p>projects in a fun, flexible, and</p>
          <p>rewarding way.</p>
        </div>
        <!-- <img src="@/assets/hero.jpg" alt /> -->
        <img src="@/assets/main-hero.jpg" alt />
      </div>
      <button class="start-now-btn" @click="startAsGuest">Try Now !</button>
    </div>

    <div class="productivity flex ">
      <img src="@/assets/productivity-hero.jpg" alt />
      <div class="txt flex col ">
        <h2>A Productivity Platform</h2>
        <h3>
          Integrate the apps your team already uses directly into your workflow.
          Power-Ups turn Trello boards into living applications to meet your team's unique business needs.
        </h3>
      </div>
    </div>

    <div class="time-management flex">
      <img src="@/assets/time management-hero.jpg" alt />
      <h2>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Nemo dolorum odit maxime omnis neque delectus laboriosam sequi assumenda cupiditate.
      </h2>
    </div>

    <div class="team-work flex">
      <img src="@/assets/team-work-hero.jpg" alt />
      <h2>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Nemo dolorum odit maxime omnis neque delectus laboriosam sequi assumenda cupiditate.
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  methods: {
    async startAsGuest() {
      const cred = { userName: "guest", password: "guest" };
      await this.$store.dispatch({ type: "login", userCred: cred });
      this.$router.push("/boards/3b44c9c13368cbfb8f1bf4b4");
    },
    goToLogin() {
      this.$router.push("/signin");
    }
  },
  components: {}
};
</script>
