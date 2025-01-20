<template>
  <link
    href="https://fonts.googleapis.com/css?family=Poppins"
    rel="stylesheet"
  />
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-primary-1 text-white text text-weight-bold text-h6"
        >TankBuddy</q-toolbar
      >
    </q-header>
    <q-footer> </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script></script>

<style>
.text {
  font-family: poppins;
}
</style>
