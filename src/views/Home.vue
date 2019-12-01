<template>
  <div class="home">

    <div class="home-header-container ">
      <div class="flex space-between">
        <h1 class="logo">TaskFlo</h1>
        <button @click="goToLogin" class="login-btn">Login</button>
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
      <button @click="goToBoards" class="start-now-btn" to="/taskfloapp">Start now</button>

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
  methods:{
    goToBoards(){
      this.$router.push('/taskfloapp');
    },
    goToLogin(){
      this.$router.push('/signin');
    }
  },
  components: {
  }
}
</script>
