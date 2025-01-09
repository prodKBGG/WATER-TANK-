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
          Devices Controller
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
        <p class="q-mb-md text-weight-bold text-caption text-primary text">
          Current Data Sensor Soil Moisture
        </p>
        <!-- data sensors and controller -->
        <div class="row q-gutter-sm">
          <q-card
            class="col q-pa-sm text-white no-shadow cardd"
            :class="{
              'bg-green-9': DATASOIL <= 1500,
              'bg-red-9': DATASOIL > 2000,
            }"
          >
            <q-item class="no-padding">
              <div class="row q-gutter-md">
                <div class="col-5 flex flex-center">
                  <q-badge
                    :class="{
                      'bg-green-5': DATASOIL <= 30,
                      'bg-red-9': DATASOIL > 50,
                    }"
                    rounded
                    class="q-pa-sm flex flex-center"
                  >
                    <lottie
                      v-if="DATASOIL > 50"
                      class="flex flex-center"
                      style="width: 30px"
                      :options="defaultOptions"
                      transition-show="fade"
                      transition-hide="fade"
                    />
                    <lottie
                      v-if="DATASOIL < 30"
                      class="flex flex-center"
                      style="width: 30px"
                      :options="defaultOptions2"
                    />
                  </q-badge>
                </div>
                <q-space />
                <div class="col text-center flex flex-center">
                  <q-item-section>
                    <q-item-label
                      style="font-size: 25px"
                      class="text-weight-bold text-white"
                      >{{ DATASOIL || 0 }}
                    </q-item-label>
                  </q-item-section>
                </div>
              </div>
            </q-item>
            <div class="q-mt-sm no-padding">
              <div class="text text-caption">Sensor condition</div>
              <p
                class="text text-caption text-weight-bold"
                v-if="DATASOIL < 1500"
              >
                Wetland
              </p>
              <p
                class="text text-caption text-weight-bold"
                v-if="DATASOIL > 1900"
              >
                Dry land
              </p>
            </div>
            <q-toggle
              v-model="relayStatus"
              color="green"
              @update:model-value="toggleRelay"
            />
            <!-- data sensors and controller -->
          </q-card>
          <q-card
            class="col q-pa-sm text-white no-shadow cardd"
            :class="{
              'bg-green-9': DATASOIL <= 1500,
              'bg-red-9': DATASOIL > 2000,
            }"
          >
            <q-item class="no-padding">
              <div class="row q-gutter-md">
                <div class="col-5 flex flex-center">
                  <q-badge
                    color="green-5"
                    rounded
                    class="q-pa-sm flex flex-center"
                  >
                    <lottie
                      v-if="DATASOIL > 1900"
                      class="flex flex-center"
                      style="width: 100px"
                      :options="defaultOptions"
                      transition-show="fade"
                      transition-hide="fade"
                    />
                    <lottie
                      v-if="DATASOIL < 1500"
                      class="flex flex-center"
                      style="width: 30px"
                      :options="defaultOptions2"
                    />
                  </q-badge>
                </div>
                <q-space />
                <div class="col text-center flex flex-center">
                  <q-item-section>
                    <q-item-label
                      style="font-size: 25px"
                      class="text-weight-bold text-white"
                      >{{ DATASOIL || 0 }}
                    </q-item-label>
                  </q-item-section>
                </div>
              </div>
            </q-item>
            <div class="q-mt-sm no-padding">
              <div class="text text-caption">Sensor condition</div>
              <p
                class="text text-caption text-weight-bold"
                v-if="DATASOIL < 1500"
              >
                Wetland
              </p>
              <p
                class="text text-caption text-weight-bold"
                v-if="DATASOIL > 1900"
              >
                Dry land
              </p>
            </div>
            <!-- data sensors and controller -->
          </q-card>
        </div>
      </q-card>

      <!-- current data Sensor -->
    </div>

    <!-- tampilan website -->
    <div v-else>
      <p class="text-caption">Realtime Data Sensor</p>
      <div class="row q-gutter-md">
        <q-card class="q-pa-sm bg-green-9 text-white col" flat>
          <p>Current Data Sensor Soil Moisture</p>
          <div class="text-center">
            <div class="text-h3 text-weight-bold">{{ DATASOIL || 0 }}</div>
          </div>
        </q-card>
        <q-card class="q-pa-sm bg-green-9 text-white col" flat>
          <p>Current Data Sensor Soil Moisture</p>
          <div class="text-center">
            <div class="text-h3 text-weight-bold">{{ DATASOIL || 0 }}</div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import mqttjs from "mqtt";
import Lottie from "src/components/lottie.vue";
import * as animationData from "assets/watering.json";
import * as animationData2 from "assets/plant.json";

export default {
  components: {
    lottie: Lottie,
  },
  data() {
    return {
      DATASOIL: "",
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
      username: "/sw_waykambas:PSTIadmin",
      password: "PSTI@server01",
      clientId: "test",
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
        this.client.subscribe("sw_waykambas", (err) => {
          if (!err) {
            console.log("Subscribed to sw_waykambas");
            this.isSubscribed = true;
          }
        });
      }
    });

    this.client.on("message", async (topic, message) => {
      try {
        const dataString = message.toString();
        const dataInt = parseInt(dataString);
        if (!isNaN(dataInt)) {
          this.DATASOIL = dataInt;
          console.log("Valid data received:", this.DATASOIL);
        } else {
          console.warn("Invalid data type, ignoring:", dataString);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });
  },
  methods: {
    toggleRelay(relayStatus) {
      const message = relayStatus ? "Relay ON" : "Relay OFF";
      console.log(message);

      // Mengirimkan pesan ON atau OFF
      if (this.client && this.isConnected) {
        this.client.publish("sw_waykambas", message);
        console.log(`Message sent: ${message}`);
      }
    },

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
};
</script>

<style>
.cardd {
  border-radius: 20px;
}

.texttitle {
  margin-bottom: 0px;
}
</style>
