<template>
    <section class="side-menu">
      <div class="flex space-between">
        <h2 class="side-menu-header">{{user.fullName}}</h2>
        <button class="logout"  @click="doLogout">Logout</button>
      </div>
      <div class="flex col align-center">
        <div class="user-img align-c">
          <div class="flex col align-center">
            <img class="user-image" :src="user.imgUrl" />
            <label>
              <div>
                <div class="flex">
                  <font-awesome-icon icon="file-upload" class="fa-icon" />
                  <p>Change Image</p>
                </div>
                <div v-if="isUploading">
                  uploading...
                </div>
              </div>
              <input hidden type="file" @change="changeUserImg($event)" />
            </label>
          </div>
        </div>
        <div v-if="user.isAdmin===true">
          User Management
          <div class="user-mgmt">
            <UserManagement v-for="user in users" :key="user._id" :user="user" @removeUser="removeUser(user)" />
          </div>
        </div>
      </div>
    </section>
</template>

<script>
import UserManagement from "./UserManagement";
import imgService from "../services/img.service.js";

export default {
  data() {
    return {
      isUploading: false
    };
  },
  methods: {
    async changeUserImg(ev) {
      this.isUploading = true;
      var res = await imgService.uploadImg(ev);
      this.isUploading = false;
      await this.$store.dispatch({ type: "changeUserImg", userImgUrl: res })
    },
    async removeUser(user){
      console.log('you want to remove user with ID: ',user._id);
      await this.$store.dispatch({ type: "removeUser", user })
    },
    showConfirmMenu() {
      this.showConfirm = !this.showConfirm;
    },
    doLogout() {
      this.$store.dispatch({ type: "logout" });
    }
  },
  computed: {
    user(){
      return this.$store.getters.loggedInUser
    },
    users(){
      return this.$store.getters.users
    },
  },
  created() {},
  components: { 
  UserManagement
  }
};
</script>

