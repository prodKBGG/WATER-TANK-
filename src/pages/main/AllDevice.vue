<template>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
  />
  <q-page class="q-pa-md bg-primary">
    <!-- untuk tampilan mobile -->
    <div v-if="$q.platform.is.mobile">
      <!-- dashboard title -->

      <q-card class="q-pa-md no-shadow q-mb-md bg-blue-1 cardd" bordered>
        <p class="text-weight-bold text-primary texttitle text text-h6">
          All Devices
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
      </div>
      <!-- your devices title and see all -->
      <!-- current data Sensor -->

      <q-card class="q-pa-md no-shadow q-mb-md bg-blue-1 cardd" bordered>
        <div class="row">
          <p class="q-mb-md text-weight-bold text-caption text-primary text">
            Device 01
          </p>
          <q-space />
          <div
            class="text text-h6 q-mb-md text-caption text-primary text text-weight-bold"
            @click="$router.push('/Device01')"
          >
            See details
            <q-icon name="arrow_right"></q-icon>
          </div>
        </div>
        <div class="row q-gutter-md">
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
                <p>Water Level {{ DATASOIL }}%</p>
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
                <p>Water Level {{ DATASOIL }}%</p>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <q-card class="no-shadow bg-blue-2 q-mt-md" style="position: relative">
          <lottie
            class="flex flex-center"
            style="width: 100%"
            :options="defaultOptions"
            transition-show="fade"
            transition-hide="fade"
          />
          <!-- Teks di atas Lottie -->
          <div
            style="
              position: absolute;
              top: 40%;
              left: 80%;
              color: white;
              font-size: 13px;
              font-weight: bold;
            "
          >
            {{ WATERFLOW }}/M
          </div>
        </q-card>
      </q-card>
      <q-card class="q-pa-md no-shadow q-mb-md bg-blue-1 cardd" bordered>
        <div class="row">
          <p class="q-mb-md text-weight-bold text-caption text-primary text">
            Device 02
          </p>
          <q-space />
          <div
            class="text text-h6 q-mb-md text-caption text-primary text text-weight-bold"
            @click="$router.push('/Device02')"
          >
            See details
            <q-icon name="arrow_right"></q-icon>
          </div>
        </div>
        <div class="row q-gutter-md">
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
                <p>Water Level {{ DATASOIL }}%</p>
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
                <p>Water Level {{ DATASOIL }}%</p>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <q-card class="no-shadow bg-blue-2 q-mt-md" style="position: relative">
          <lottie
            class="flex flex-center"
            style="width: 100%"
            :options="defaultOptions"
            transition-show="fade"
            transition-hide="fade"
          />
          <!-- Teks di atas Lottie -->
          <div
            style="
              position: absolute;
              top: 40%;
              left: 80%;
              color: white;
              font-size: 13px;
              font-weight: bold;
            "
          >
            {{ WATERFLOW }}/M
          </div>
        </q-card>
      </q-card>
      <!-- current data Sensor -->
    </div>

    <!-- tampilan website -->
    <div v-else>
      <p class="text-caption">-</p>
    </div>
  </q-page>
</template>

<script>
import mqttjs from "mqtt";
import Lottie from "src/components/lottie.vue";
import * as animationData from "assets/flow.json";
import * as animationData2 from "assets/flow2.json";

export default {
  components: {
    lottie: Lottie,
  },
  data() {
    return {
      DATASOIL: "0",
      WATERFLOW: "0",
      client: null,
      message: "",
      relayStatus: false,
      isConnected: false,
      defaultOptions: { animationData: animationData.default },
      animationSpeed: 2,
      defaultOptions2: { animationData: animationData2.default },
      animationSpeed2: 2,
    };
  },

  mounted() {
    const options = {
      username: "/smkpkl:smkpkl",
      password: "smkpkl",
      clientId: "test12",
      protocolId: "MQTT",
      reconnectPeriode: 0,
      keepAlive: 0,
    };
    const reconnectOptions = {
      reconnectPeriod: 1000, // reconnect
    };

    this.client = mqttjs.connect(
      "ws://195.35.23.135:15675/ws",
      options,
      reconnectOptions
    );

    this.client.on("connect", () => {
      if (!this.isConnected) {
        console.log("Connected to MQTT server");
        this.isConnected = true;
      }

      if (!this.isSubscribed) {
        this.client.subscribe("gambar", (err) => {
          if (!err) {
            console.log("Subscribed to smk");
          }
        });

        // Subscribe to WATERFLOW topic
        this.client.subscribe("waterflow", (err) => {
          if (!err) {
            console.log("Subscribed to WATER topic");
          }
        });

        this.isSubscribed = true;
      }
      // Subscribe to WATERFLOW topic
    });

    this.client.on("message", async (topic, message) => {
      try {
        const dataString = message.toString();
        const dataInt = parseInt(dataString);
        if (!isNaN(dataInt)) {
          if (topic === "gambar") {
            this.DATASOIL = dataInt;
            console.log("Valid data abc:", this.DATASOIL);
          } else if (topic === "waterflow") {
            this.WATERFLOW = dataInt;
            console.log("Valid data water:", this.WATERFLOW);
          }
        } else {
          console.warn("Invalid data type, ignoring:", dataString);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });
  },
  methods: {
    handleAnimation: function (anim) {
      this.anim = anim;
    },
    stop: function () {
      this.anim.stop();
    },
    play: function () {
      this.anim.play();
    },
    pause: function () {
      this.anim.pause();
    },
    onSpeedChange: function () {
      this.anim.setSpeed(this.animationSpeed);
    },
  },
  computed: {
    waterLevel() {
      // Pastikan nilai berada di antara 0-100
      return Math.max(0, Math.min(100, this.DATASOIL));
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
  position: center;
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
