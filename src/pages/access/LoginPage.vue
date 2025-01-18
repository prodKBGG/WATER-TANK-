<template>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
  />
  <link
    href="https://fonts.googleapis.com/css?family=Poppins"
    rel="stylesheet"
  />

  <q-page class="bg-image flex flex-center">
    <img
      src="~/src/assets/bglogin1.jpeg"
      alt="Gambar"
      class="absolute-full"
      height="800"
      width="100%"
      style="opacity: 0.5"
    />

    <!-- untuk tampilan mobile -->

    <div v-if="$q.platform.is.mobile" class="q-pa-md">
      <div class="centered-div">
        <div class="row justify-center">
          <div class="col-12 col-md-6">
            <div class="col-6 flex flex-center">
              <q-card class="q-pa-md bg-primary-9 text-primary cardd no-shadow">
                <!-- keterangan card Login -->
                <div class="text_login text-h5 text-center">Login</div>
                <div class="text-caption text-center">
                  Masukkan username dan password anda
                </div>
                <!-- keterangan card Login -->
                <q-form @submit="LoginSubmit" class="q-mt-md">
                  <q-input
                    v-model="username"
                    outlined
                    label="username"
                    label-color="primary"
                    dense
                    color="primary"
                    input-class="text-primary"
                    lazy-rules
                    :rules="defaultRules"
                    ><template v-slot:append>
                      <q-icon
                        name="person"
                        class="text-primary"
                      ></q-icon></template
                  ></q-input>
                  <q-input
                    v-model="password"
                    outlined
                    label="password"
                    dense
                    label-color="primary"
                    color="primary"
                    input-class="text-primary"
                    lazy-rules
                    :rules="defaultRules"
                    :type="isPwd ? 'password' : 'text'"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer text-white"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                  <div class="q-mt-md">
                    <q-btn
                      label="Submit"
                      type="submit"
                      color="primary"
                      class="text-capitalize text_submit full-width flex flex-center"
                    />
                  </div>
                </q-form>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute-bottom q-pa-md">
      <q-footer class="bg-primary-9 text-white">
        <q-toolbar>
          <q-toolbar-title class="text-center">Copyright 2023</q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </div>
  </q-page>
</template>

<script>
import { route } from "quasar/wrappers";
import { Notify, QSpinnerPie } from "quasar";

export default {
  data() {
    return {
      username: "",
      password: "",
      message: "",
      isPwd: true,
      defaultRules: [(val) => (val && val.length > 0) || "Tidak Boleh Kosong"],
      loggedInUser: "User",
    };
  },

  methods: {
    LoginSubmit() {
      if (
        (this.username === "admin" && this.password === "admin") ||
        (this.username === "rifki" && this.password === "123")
      ) {
        this.$router.push({ path: "/home" });
        Notify.create({
          message: `Selamat Datang, ${localStorage.getItem("loggedInUser")}`,
          position: "top",
          textColor: "white",
          spinner: QSpinnerPie,
          color: "primary",
        });
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loggedInUser", this.username);
      } else {
        Notify.create({
          message: "Username atau Password yang Valid",
          position: "top",
          textColor: "white",
          spinner: QSpinnerPie,
          color: "red",
        });
      }
    },
  },
  mounted() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn) {
      // Jika sudah login, arahkan langsung ke halaman home
      this.$router.push({ path: "/home" });
    }
  },
};
</script>

<style>
.cardd {
  border-radius: 20px;
}

.texttitle {
  margin-bottom: 0px;
}
.text_login {
  font-family: poppins;
  font-weight: 900;
}
.text_submit {
  font-family: poppins;
  font-weight: 900;
  color: #504525;
}
.bg-image {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
