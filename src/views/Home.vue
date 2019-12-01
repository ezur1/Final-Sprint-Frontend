<template>
  <div class="home">

    <div class="home-header-container ">
      <div class="flex space-between">
        <h1 class="logo">TaskFlo</h1>
        <button class="login-btn">Login</button>
      </div>

      
      <div class="greet flex justify-center space-around">
        <div>
        <h1>TaskFlo lets you work more </h1>
        <h1> collaboratively and get more done.</h1>
        <p>TaskFlo’s boards, lists, and cards enable </p>
          <p>you to organize and prioritize your </p>
          <p>projects in a fun, flexible, and </p>
          <p>rewarding way.</p>
          </div>
          <img src="@/assets/hero.jpg" alt="">
      </div>
      <button class="start-now-btn" @click="startAsGuest">Try Now !</button>

    </div>

    <div class="features">
      <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Nemo dolorum odit maxime omnis neque delectus laboriosam sequi assumenda cupiditate. 
        Illum porro libero debitis quam laborum odio impedit dicta eum pariatur?
      </h2>
    </div>
  </div>
</template>

<script>

export default {
  name: 'home',
  methods: {
    startAsGuest() {
      const cred = {userName: "guest", password: "guest"}
      return this.$store.dispatch({type :'login', userCred:cred})
      .then (() =>{
        this.$router.push('/boards/3b44c9c13368cbfb8f1bf4b4');
      })
    }
  },
  components: {
  }
}
</script>
