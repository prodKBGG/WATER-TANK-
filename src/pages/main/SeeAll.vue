<template>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
  />
  <q-page class="q-pa-md bg-primary">
    <!-- untuk tampilan mobile -->
    <div v-if="$q.platform.is.mobile">
      <!-- dashboard title -->
      <!-- current data Sensor -->

      <q-card class="q-pa-md no-shadow q-mb-md bg-blue-1 cardd" bordered>
        <div class="row">
          <p class="q-mb-md text-weight-bold text-caption text-primary text">
            Current Data Water Tank
          </p>
          <q-space />
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
      </q-card>
      <div></div>
      <!-- Toggle Button -->
      <q-card class="q-pa-md no-shadow q-mb-md bg-blue-1 cardd" bordered>
        <div class="row items-center justify-between">
          <p class="text-weight-bold text-primary texttitle text text-h6">
            Indikator Pompa
          </p>
          <q-toggle
            v-model="deviceStatus"
            color="green"
            track-color="grey-5"
            dark
            :disable="true"
          />
        </div>
      </q-card>
        <!-- Toggle Button -->
        <q-card class="q-pa-md no-shadow q-mb-md bg-blue-1 cardd" bordered>
        <div class="row items-center justify-between">
          <p class="text-weight-bold text-primary texttitle text text-h6">
            Tombol
          </p>
          <q-toggle
            v-model="buttonStatus"
            color="green"
            track-color="grey-5"
            dark
            @update:model="onManualToggleChange"
          />
        </div>
      </q-card>
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

      <!-- Spacer Div -->
      <div class="spacer"></div>

      <!-- History Card -->
      <div class="history-card">
        <div class="history-title">Water Output History</div>
        <div class="history-data animated">
          <p>Total Water Output: <span class="highlight">{{ formattedTotalWaterOutput }}</span> Liters</p>
        </div>
        <button class="history-reset-btn" @click="confirmReset">Reset Data</button>
      </div>

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
import axios from 'axios';

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
      deviceStatus: true, // Toggle state: false = OFF, true = ON
      buttonStatus: false,
      totalWaterOutput: 0.0, // Track the total water output
      lastUpdateTime: Date.now(), // To calculate time deltas
      formattedTotalWaterOutputData: '',
    };
  },

  created() {
  // Start an interval to send data to the backend every 10 seconds (adjust as needed)
  this.intervalId = setInterval(() => {
    this.sendData();
  }, 10000);  // Send data every 10 seconds (you can adjust the interval as needed)
  },

  watch: {
    waterLevel(newLevel) {
      // Automatically update the toggle state based on water level
      this.deviceStatus = newLevel < 30;
    },

    buttonStatus(newStatus) {
      console.log("Device is now:", newStatus ? "ON" : "OFF");
    }
  },

  mounted() {
    // Fetch the initial history data
    axios.get('http://localhost:3000/history')
      .then(response => {
        this.totalWaterOutput = response.data.totalWaterOutput;
      })
      .catch(error => {
        console.error('Error fetching history:', error);
      });

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

    this.startWaterFlowTracking();
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
    subscribeToTopics() {
      const topics = ["gambar", "waterflow"];
      topics.forEach((topic) => {
        this.client.subscribe(topic, (err) => {
          if (!err) {
            console.log(`Subscribed to topic: ${topic}`);
          } else {
            console.error(`Failed to subscribe to topic ${topic}:`, err);
          }
        });
      });
    },

    onManualToggleChange(newState) {
      console.log("Manual toggle changed to:", newState ? "ON" : "OFF");

      if (newState && this.WATERFLOW > 0) {
        // Calculate the output and add it to the total
        const waterOutput = this.WATERFLOW * 0.001; // Example multiplier
        this.totalWaterOutput += waterOutput;
      }

      if (this.client && this.client.connected) {
        const topic = "gambar";
        const message = newState ? "Relay ON" : "Relay OFF";

        this.client.publish(topic, message, (err) => {
          if (err) {
            console.error("Failed to publish message:", err);
          } else {
            console.log(`Published "${message}" to topic "${topic}"`);
          }
        });
      } else {
        console.warn("MQTT client is not connected");
      }
    },

    confirmReset() {
    this.$q.notify({
      message: "Are you sure you want to reset the water output history?",
      color: "red",
      icon: "warning",
      position: "center",
      actions: [
        {
          label: "Yes",
          color: "white",
          handler: () => {
            this.totalWaterOutput = 0; // Reset the total output
            this.$q.notify({
              message: "Water output history has been reset.",
              color: "positive",
              icon: "check_circle",
              position: "center",
            });
          },
        },
        {
          label: "Cancel",
          color: "white",
        },
      ],
    });
  },

  sendData() {
    const payload = { formattedTotalWaterOutput: this.formattedTotalWaterOutput };

    fetch('https://228a-103-230-48-148.ngrok-free.app/history-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Data sent successfully:', data);
    })
    .catch((error) => {
      console.error('Error sending data:', error);
    });
  },

    // Start tracking water flow
    startWaterFlowTracking() {
      setInterval(() => {
        const currentTime = Date.now();
        const timeElapsed = (currentTime - this.lastUpdateTime) / 60000; // Convert ms to minutes
        const flowRate = parseFloat(this.WATERFLOW); // Current flow rate (liters per minute)

        if (!isNaN(flowRate) && flowRate > 0) {
          // Increment total water output based on elapsed time
          this.totalWaterOutput += flowRate * timeElapsed;
        }

        this.lastUpdateTime = currentTime; // Update last update time
      }, 1); // Update every second
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

    // Ensure total water output is always a rounded number
    formattedTotalWaterOutput() {
    return this.totalWaterOutput.toFixed(2); // Display 2 decimal places
    },
  },

  async updateTotalWaterOutput(newOutput) {
      try {
        const response = await axios.put('https://228a-103-230-48-148.ngrok-free.app/history', { totalWaterOutput: newOutput });
        if (response.status === 200) {
          console.log(response.data.message);
          this.totalWaterOutput = newOutput;
          // Add animation or other logic here as needed
        }
      } catch (error) {
        console.error('Error updating history:', error);
      }
    },

    async confirmReset() {
      try {
        const response = await axios.delete('https://228a-103-230-48-148.ngrok-free.app/history');
        if (response.status === 200) {
          console.log(response.data.message);
          this.totalWaterOutput = 0.0;
        }
      } catch (error) {
        console.error('Error resetting history:', error);
      }
    },
};
</script>

<style>
.cardd {
  border-radius: 20px;
}

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

/* General Styling */
.waterflow-card,
.history-card {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.waterflow-card {
  background-color: #2196f3;
  color: white;
  text-align: center;
}

.history-card {
  background-color: #f8f9fa;
  color: #444;
  text-align: center;
}

/* Spacer */
.spacer {
  height: 25px;
}

/* Titles */
.waterflow-title,
.history-title {
  font-size: 18px;
  font-weight: bold;
}

/* Highlighted Text */
.highlight {
  color: #ff5722;
  font-weight: bold;
}

/* Reset Button */
.history-reset-btn {
  background-color: #ff5722;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.history-reset-btn:hover {
  background-color: #e64a19;
}

/* Animation for History Total Liters */
@keyframes pop {
  0% {
    transform: scale(1);
    color: #444;
  }
  50% {
    transform: scale(1.2);
    color: #ff5722;
  }
  100% {
    transform: scale(1);
    color: #444;
  }
}

.history-data.animated .highlight {
  animation: pop 0.6s ease-in-out;
}


</style>
