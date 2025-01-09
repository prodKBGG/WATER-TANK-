<template>
  <link
    href="https://fonts.googleapis.com/css?family=Poppins"
    rel="stylesheet"
  />
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-primary q-pa-sm">
        <q-btn flat round dense icon="info" class="q-mr-sm" />
        <q-space />
        <q-avatar clickable @click="isDialogOpen = true" class="cursor-pointer">
          <img
            src="https://i.pinimg.com/736x/49/34/f7/4934f76b7c8d0f0c290707b29dbc322e.jpg"
          />
        </q-avatar>
      </q-toolbar>
    </q-header>
    <q-footer>
      <q-tabs
        v-model="tab"
        active-color="white bg-blue-6"
        class="text-white bg-primary"
        align="justify"
      >
        <q-route-tab to="/home" name="home"
          ><i class="bi bi-house-door-fill text-h5"></i
        ></q-route-tab>
        <q-route-tab icon="devices" to="/AllDevices" name="remote" />
      </q-tabs>
    </q-footer>

    <q-dialog v-model="isDialogOpen" persistent>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="text-center">
          <img
            src="https://i.pinimg.com/736x/49/34/f7/4934f76b7c8d0f0c290707b29dbc322e.jpg"
            alt="Avatar"
            style="width: 50px; height: 50px; border-radius: 50%"
          />
          <p class="q-mt-md">
            Ini adalah dialog yang muncul setelah mengklik avatar.
          </p>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            icon="power_settings_new"
            label="logout"
            flat
            class="text-capitalize"
            color="red"
            @click="logout"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      tab: ref("home"),
    };
  },
  data() {
    return {
      isDialogOpen: false,
    };
  },

  methods: {
    logout() {
      // Hapus isLoggedIn dari localStorage
      localStorage.removeItem("isLoggedIn");
      // Arahkan pengguna ke halaman login
      this.$router.push("/");
    },
  },
};
</script>

<style>
.text {
  font-family: poppins;
}
</style>
