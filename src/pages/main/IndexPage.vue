<template>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
  />
  <q-page class="q-pa-md bg-primary">
    <!-- untuk tampilan mobile -->
    <div v-if="$q.platform.is.mobile">
      <!-- title page -->
      <div>
        <div class="text text-h6 text-white text-weight-bold">Hello, User</div>
        <div class="text text-h6 text-white q-mb-md text-caption text-blue-2">
          Welcome back to home
        </div>
      </div>
      <!-- title page -->
      <!-- dashboard title -->
      <q-card class="q-pa-md no-shadow q-mb-md bg-blue-1 cardd" bordered>
        <p class="text-weight-bold text-primary texttitle text text-h6">
          Home page
        </p>
        <p class="text-weight-bold text-caption text-grey-5 text">
          Water is the driving force of all nature
        </p>
      </q-card>
      <!-- dashboard title -->
      <!-- your devices title and see all -->
      <div class="row">
        <div
          class="text text-h6 text-white q-mb-md text-caption text-blue-2 col-9 q-ml-sm"
        >
          Your Devices
        </div>
        <div
          class="text text-h6 text-white q-mb-md text-caption text-blue-2 col"
          @click="$router.push('/AllDevices')"
        >
          See all
          <q-icon name="arrow_right"></q-icon>
        </div>
      </div>
      <!-- your devices title and see all -->
      <!-- current data Sensor -->
      <q-card class="q-pa-md no-shadow q-mb-md bg-blue-1 cardd" bordered>
        <p class="q-mb-md text-weight-bold text-caption text-primary text">
          Current Data Water Tank
        </p>
        <div class="row q-gutter-sm">
          <q-card class="tank-container no-shadow q-pa-sm col">
            <div class="tank">
              <div
                class="water"
                :style="{
                  height: waterLevel + '%',
                  backgroundColor: waterColor,
                }"
              ></div>
            </div>
            <q-card-section>
              <div class="text-center text text-weight-bold textcoy">
                <p>Water Level {{ DATA_TANGKI }}%</p>
              </div>
            </q-card-section>
          </q-card>
          <q-card class="tank-container no-shadow q-pa-sm col">
            <div class="tank">
              <div
                class="water"
                :style="{
                  height: waterLevel + '%',
                  backgroundColor: waterColor,
                }"
              ></div>
            </div>
            <q-card-section>
              <div class="text-center text text-weight-bold textcoy">
                <p>Water Level {{ DATA_TANGKI }}%</p>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-card>
      <!-- current data Sensor -->
    </div>
  </q-page>
</template>

<script>
import mqttjs from "mqtt";

export default {
  data() {
    return {
      DATA_TANGKI: "",
    };
  },

  mounted() {
    const options = {
      username: "/smkpkl:smkpkl",
      password: "smkpkl",
      clientId: "test",
      protocolId: "MQTT",
      reconnectPeriode: 0,
      keepAlive: 0,
    };
    const reconnectOptions = {
      reconnectPeriod: 1000, // reconnect
    };

    const client = mqttjs.connect(
      "ws://195.35.23.135:15675/ws",
      options,
      reconnectOptions
    );

    client.on("connect", () => {
      if (!this.isConnected) {
        console.log("Connected to MQTT server");
        this.isConnected = true;
      }
      // Subscribed hanya dilakukan sekali
      if (!this.isSubscribed) {
        client.subscribe("gambar", (err) => {
          if (!err) {
            console.log("Subscribed to gambar");
            this.isSubscribed = true;
          }
        });
      }
    });
    client.on("message", async (topic, message) => {
      try {
        // Mengubah data dari buffer ke string
        const dataString = message.toString();
        // mengubah data menjadi int
        const dataInt = parseInt(dataString);
        // Menyimpan data integer ke variabel
        this.DATA_TANGKI = dataInt;
        // Menampilkan data string di konsol
        console.log(this.DATA_TANGKI);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });
  },

  computed: {
    waterLevel() {
      // Pastikan nilai berada di antara 0-100
      return Math.max(0, Math.min(100, this.DATA_TANGKI));
    },
    waterColor() {
      // Warna dinamis berdasarkan level air
      if (this.waterLevel > 75) return "darkblue";
      if (this.waterLevel > 50) return "blue";
      if (this.waterLevel > 25) return "yellow";
      return "red";
    },
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

.tank-container {
  max-width: 100px;
  max-height: 225px;
  text-align: center;
}

.tank {
  position: relative;
  width: 110px;
  height: 150px;
  border: 2px solid #000;
  border-radius: 5px;
  overflow: hidden;
  margin: auto;
}

.water {
  position: absolute;
  bottom: 0;
  width: 100%;
  transition: height 0.5s ease-in-out;
}
</style>
