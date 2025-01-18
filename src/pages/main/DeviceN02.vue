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
        <p class="text-weight-bold text-primary texttitle text text-h6">
          Device 02
        </p>
        <p class="text-weight-bold text-caption text-grey-5 text">
          Water is the driving force of all nature
        </p>
        <q-space />
        <div>
          <q-btn
            class="bg-primary text-capitalize text text-weight-bold"
            label="Save Data"
            text-color="white"
            icon="save"
            @click="showSaveDataDialog"
            size="md"
          />
        </div>
      </q-card>

      <q-card class="q-pa-md no-shadow q-mb-md bg-blue-1 cardd" bordered>
        <div class="row text-center flex flex-center">
          <p class="q-mb-md text-weight-bold text-caption text-primary text">
            Current Data Water Tank
          </p>
          <q-space />
          <q-badge class="q-mb-md" v-if="DATASOIL < 30">ON</q-badge>
          <q-badge class="q-mb-md bg-red-8" v-if="DATASOIL > 30">OFF</q-badge>
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
        <q-card class="col q-pa-md no-shadow q-mt-md bg-primary cardd" bordered>
          <div class="row items-center justify-between">
            <q-toggle
              v-model="buttonStatus"
              color="green"
              track-color="grey-5"
              dark
              @update:model="onManualToggleChange"
            />
            <p class="texttitle text text-weight-bold text-white">
              Relay Controller
            </p>
          </div>
        </q-card>
      </q-card>

      <!-- Toggle Button -->

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
          <p>
            Total Water Output:
            <span class="highlight text-primary">{{
              formattedTotalWaterOutput
            }}</span>
            Liters
          </p>
        </div>
        <button class="history-reset-btn bg-primary" @click="confirmReset">
          Reset Data
        </button>
      </div>

      <!-- Spacer Div -->
      <div class="spacer"></div>

      <!-- Save Data Button -->

      <!-- Save Data Form -->
      <q-dialog v-model="showSaveData" persistent>
        <q-card class="q-pa-sm">
          <q-card-section>
            <q-form class="row q-gutter-md flex flex-center">
              <q-input
                label="Device Name"
                v-model="formData.deviceName"
                readonly
                outlined
                class="col-12"
              />
              <q-input
                label="Total Water Level"
                v-model="formData.waterLevel"
                readonly
                outlined
                class="col-12"
              />
              <q-input
                label="Total Water Output"
                v-model="formData.waterOutput"
                outlined
                readonly
                class="col-12"
              />
              <q-date
                v-model="formData.date"
                label="Date"
                :auto-save="false"
                style="max-width: 300px"
              />
            </q-form>
          </q-card-section>
          <q-card-actions>
            <q-btn label="Submit" color="primary" @click="submitData" />
            <q-btn label="Cancel" flat @click="showSaveData = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Spacer Div -->
      <div class="spacer"></div>

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
import axios from "axios";

export default {
  components: {
    lottie: Lottie,
  },
  data() {
    return {
      deviceName: "N-02",
      DATASOIL: "",
      WATERLEVEL: "",
      WATERFLOW: "0",
      client: null,
      message: "",
      relayStatus: false,
      isConnected: false,
      defaultOptions: { animationData: animationData.default },
      animationSpeed: 2,
      defaultOptions2: { animationData: animationData2.default },
      animationSpeed2: 2,
      buttonStatus: false,
      totalWaterOutput: 0.0, // Track the total water output
      lastUpdateTime: Date.now(), // To calculate time deltas
      formattedTotalWaterOutputData: "",
      chartData: {
        labels: [], // Chart labels will be populated based on your data
        datasets: [
          {
            label: "Data",
            data: [], // Chart data points
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            title: {
              display: true,
              text: "Value",
            },
          },
        },
      },
      showSaveData: false,
      formData: {
        deviceName: "",
        waterLevel: "",
        waterOutput: "",
        date: "",
      },
      dailyData: [],
    };
  },

  watch: {
    waterLevel(newLevel) {
      // Automatically update the toggle state based on water level
      this.deviceStatus = newLevel < 30;
    },

    buttonStatus(newStatus) {
      console.log("Device is now:", newStatus ? "ON" : "OFF");
    },

    totalWaterOutput() {
      this.updateData();
    },

    // Automatically update waterOutput with formattedTotalWaterOutput
    formattedTotalWaterOutput(newValue) {
      this.formData.waterOutput = newValue;
    },
    // Automatically update waterLevel with current waterLevel
    waterLevel(newValue) {
      this.formData.waterLevel = newValue;
    },
  },

  mounted() {
    // Fetch current data from the backend in Vue
    axios.get("http://localhost:3000/data").then((response) => {
      this.totalWaterOutput = response.data.totalWaterOutput;
      this.updateChart(response.data.weeklyData); // Update chart with historical data
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

    updateData() {
      const dataToSend = {
        totalWaterOutput: this.totalWaterOutput,
      };

      // Sending POST request to backend
      axios
        .post("http://localhost:3000/data", dataToSend)
        .then((response) => {
          if (response.status === 200) {
            console.log("Data updated successfully:", response.data);
          } else {
            console.error("Update failed:", response);
          }
        })
        .catch((error) => {
          console.error(
            "Error during data update:",
            error.response ? error.response.data : error.message
          );
        });
    },

    updateChart() {
      // Logic to fetch or process data based on the selected date
      // You can fetch new data and update `chartData` here
      console.log("Date selected:", this.selectedDate);
      // Example data update:
      this.chartData.labels = [
        /* Your dynamic labels based on selectedDate */
      ];
      this.chartData.datasets[0].data = [
        /* Your dynamic data based on selectedDate */
      ];
    },

    showSaveDataDialog() {
      this.showSaveData = true;
      this.formData.deviceName = this.deviceName;
      this.formData.waterLevel = this.DATASOIL; // Pre-fill waterLevel
      this.formData.waterOutput = this.formattedTotalWaterOutput; // Pre-fill waterOutput
      this.formData.date = this.getSelectedDate(); // Get date from calendar
    },

    submitData() {
      if (
        !this.formData.waterOutput ||
        !this.formData.date ||
        !this.formData.waterLevel ||
        !this.formData.deviceName
      ) {
        this.$q.notify({
          message: "All fields must be provided",
          color: "negative",
          icon: "warning",
          position: "center",
        });
        return;
      }

      const dataToSend = {
        deviceName: this.formData.deviceName,
        dailyOutput: this.formData.waterOutput,
        waterLevel: this.formData.waterLevel,
        date: this.formData.date, // Date from the calendar formatted as YYYY-MM-DD
      };

      axios
        .post("http://localhost:3000/save-daily-data", dataToSend)
        .then((response) => {
          if (response.status === 200) {
            console.log("Data saved successfully:", response.data);
            this.$q.notify({
              message: "Data saved successfully",
              color: "positive",
              icon: "check_circle",
              position: "center",
            });
            this.showSaveData = false;
          } else {
            console.error("Save failed:", response);
          }
        })
        .catch((error) => {
          console.error(
            "Error during form submission:",
            error.response ? error.response.data : error.message
          );
          this.$q.notify({
            message: "Error during form submission",
            color: "negative",
            icon: "warning",
            position: "center",
          });
        });
    },

    getSelectedDate() {
      // Get the selected date from the calendar
      const selectedDate = this.$refs.calendar.value;
      if (selectedDate) {
        const localDate = new Date(selectedDate); // Local time selected from the calendar
        console.log("Local Date:", localDate); // Log local date for debugging
        const utcDate = new Date(localDate.toUTCString()); // Convert to UTC
        console.log("UTC Date:", utcDate); // Log UTC date for debugging
        utcDate.setHours(0, 0, 0, 0); // Ensure date is set to midnight in UTC
        return utcDate; // Return the UTC formatted date with 00:00:00 as midnight
      }
      return null;
    },

    openCalendar() {
      this.$refs.calendar.open();
    },

    // Start tracking water flow
    startWaterFlowTracking() {
      setInterval(() => {
        const currentTime = Date.now();
        const timeElapsed = (currentTime - this.lastUpdateTime) / 60000; // Convert ms to minutes
        const flowRate = parseFloat(this.WATERFLOW); // Current flow rate (liters per minute)

        if (!isNaN(flowRate) && flowRate > 0) {
          // Increment total water output
          this.totalWaterOutput += flowRate * timeElapsed; // Add the output since the last update
          this.lastUpdateTime = currentTime; // Update the last update time

          // Format the total output for display
          this.formattedTotalWaterOutput = this.totalWaterOutput.toFixed(2); // Keep 2 decimal places
          console.log(
            `Water output updated: ${this.formattedTotalWaterOutput} liters`
          );
        }
      }, 1000); // Update every second (adjust as needed)
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

  // async updateTotalWaterOutput(newOutput) {
  //   try {
  //     const response = await axios.put(
  //       "http://localhost:3000/history",
  //       { totalWaterOutput: newOutput }
  //     );
  //     if (response.status === 200) {
  //       console.log(response.data.message);
  //       this.totalWaterOutput = newOutput;
  //       // Add animation or other logic here as needed
  //     }
  //   } catch (error) {
  //     console.error("Error updating history:", error);
  //   }
  // },

  async confirmReset() {
    try {
      const response = await axios.delete("http://localhost:3000/history");
      if (response.status === 200) {
        console.log(response.data.message);
        this.totalWaterOutput = 0.0;
      }
    } catch (error) {
      console.error("Error resetting history:", error);
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

.save-button {
  background-color: white; /* Button background color set to white */
  color: black; /* Font color set to black */
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, transform 0.2s ease;
  border: 1px solid black; /* Adds border to the button */
}

.save-button:hover {
  background-color: #f0f0f0; /* Lighter shade on hover */
  transform: scale(1.05); /* Slight scaling on hover */
}

.save-button .q-icon {
  margin-right: 8px; /* Spacing between icon and text */
}
</style>
