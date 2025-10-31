<template>
  <v-footer padless>
    <v-sheet class="footer-wrap" width="100%" elevation="0" color="#0f1724">
      <v-container class="py-12">
        <v-row>
          <v-col cols="12" md="4">
              <v-img :src="logo" contain height="50" width="300" class="" />
            <div class="mt-4 desc">
              A marketplace for pre-loved fashion & home goods. Connect
              sellers and buyers easily.
            </div>
            <div class="mt-4 social d-flex ">
              <v-btn icon small class="me-2" aria-label="twitter"
                ><v-icon>mdi-twitter</v-icon></v-btn
              >
              <v-btn icon small class="me-2" aria-label="facebook"
                ><v-icon>mdi-facebook</v-icon></v-btn
              >
              <v-btn icon small aria-label="instagram"
                ><v-icon>mdi-instagram</v-icon></v-btn
              >
            </div>
          </v-col>
          <v-col cols="12" md="2">
            <v-list class="bg-transparent">
              <v-list-item @click="$router.push({ name: 'product-list' })"
                ><v-list-item-title>Shop</v-list-item-title></v-list-item
              >
              <v-list-item @click="$router.push({ name: 'product-mine' })"
                ><v-list-item-title>My Products</v-list-item-title></v-list-item
              >
              <v-list-item @click="$router.push({ name: 'profile' })"
                ><v-list-item-title>Profile</v-list-item-title></v-list-item
              >
            </v-list>
          </v-col>
          <v-col cols="12" md="3">
            <v-list class="bg-transparent">
              <v-list-item
                ><v-list-item-title>Help Center</v-list-item-title></v-list-item
              >
              <v-list-item
                ><v-list-item-title
                  >Terms & Privacy</v-list-item-title
                ></v-list-item
              >
              <v-list-item
                ><v-list-item-title>Contact</v-list-item-title></v-list-item
              >
            </v-list>
          </v-col>
          <v-col cols="12" md="3">
            <div class="">Email: support@gmail.com</div>
            <div class=" mt-2">Phone: +91 9999999999</div>
          </v-col>
        </v-row>
        <v-divider class="my-6" />
        <div class="mx-auto">
            © {{ year }} FreeUp POC. All rights reserved.
        </div>
      </v-container>
    </v-sheet>
  </v-footer>
</template>
<script setup>
import logo from "@/assets/images/logo.png";
import { ref } from "vue";
const year = new Date().getFullYear();
</script>
<style scoped>
.footer-wrap {
  color: #e6eef8;
  background: linear-gradient(180deg, #0f1724 0%, #071124 100%);
}

.desc {
  color: #b9c6d8;
  max-width: 320px;
}

</style>
