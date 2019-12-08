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
    <div class="devs flex  align-c space-around wrap">
      <div class="dev">
        <img class="dev-avatar" src="@/assets/img/ohad.jpg" alt="">
        <h2>Ohad Leshem</h2>
        <div class="social-media-logo">
          <img src="@/assets/img/github-logo.png" alt="github">
          <img src="@/assets/img/facebook.png" alt="facebook">
        </div>
        
      </div>
      <div class="dev">
        <img class="dev-avatar" src="@/assets/img/natan.jpg" alt="">
        <h2>Natan yagodayv</h2>
        <div class="social-media-logo">
          <img @click="goToGithub('https://github.com/natan-git')" src="@/assets/img/github-logo.png" alt="github">
          <img @click="goToGithub('https://www.facebook.com/natan.yagodayv')" src="@/assets/img/facebook.png" alt="facebook">
        </div>
      </div>
      <div class="dev">
        <img class="dev-avatar" src="@/assets/img/elior.jpg" alt="">
        <h2>Elior zur</h2>
        <div class="social-media-logo">
          <img src="@/assets/img/github-logo.png" alt="github">
          <img src="@/assets/img/facebook.png" alt="facebook">

        </div>

      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import mainNavBar from '../components/MainNavBar.vue'
import Footer from "../components/Footer.vue";

export default {
  components:{
    mainNavBar,
    Footer
  },
  methods: {
    goToGithub(url){
      window.open(url, '_blank');
    },
    goToFacebook(url){
      window.open(url, '_blank');
    }
  },
  
}
</script>
