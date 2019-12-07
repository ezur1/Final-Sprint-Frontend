<template>
  <div class="about">
    <mainNavBar/>
    <div class="main-about-page-content">
      <div class="about-header flex justify-center align-c ">
        <div class="contact-us">
          <h1>Contact us</h1>
          <P>We're here to help and answer any question you might have.</P>
          <P>We look forward to hearing from you.</P>
        </div>
      </div>
    </div>
    <div class="devs flex  align-c space-around">
      <div class="ohad">
        <img src="@/assets/img/ohad.jpg" alt="">
        <h2>Ohad Leshem</h2>
        <font-awesome-icon class="social-media-icon" icon="github-square" />
      </div>
      <div class="natan">
        <img src="@/assets/img/natan.jpg" alt="">
        <h2>Natan yagodayv</h2>
        <font-awesome-icon icon="github" />
      </div>
      <div class="elior">
        <img src="@/assets/img/elior.jpg" alt="">
        <h2>Elior zur</h2>
        <font-awesome-icon class="icon" icon="github" />

      </div>
    </div>
  </div>
</template>

<script>
import mainNavBar from '../components/MainNavBar.vue'
export default {
  components:{
    mainNavBar
  }
  
}
</script>
