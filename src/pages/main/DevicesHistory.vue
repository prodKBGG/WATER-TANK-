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
          Devices History
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
          Your Devices History
        </div>
      </div>
      <q-card class="q-pa-sm bg-blue-1 cardd">
        <q-table
          :rows="rows"
          class="bg-blue-1 text-primary"
          :columns="columns"
          row-key="_id"
          bordered
          flat
          dense
        >
          <template v-slot:top-right> </template>
        </q-table>
      </q-card>
    </div>

    <!-- tampilan website -->
    <div v-else>
      <p class="text-caption">-</p>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      rows: [], // Data dari database
      columns: [
        {
          name: "deviceName",
          label: "Device Name",
          field: "deviceName",
          align: "left",
          sortable: true,
        },
        {
          name: "totalWaterTank",
          label: "Total Water Tank",
          field: "totalWaterTank",
          align: "right",
          sortable: true,
        },
        {
          name: "totalWaterOutput",
          label: "Total Water Output",
          field: "totalWaterOutput",
          align: "right",
          sortable: true,
        },
        {
          name: "date",
          label: "Date",
          field: "date",
          align: "center",
          sortable: true,
        },
      ],
    };
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      try {
        // Fetch all data from the /getall endpoint
        const response = await axios.get("http://localhost:3000/getall");

        // Checking if data exists in the response
        if (response.data && response.data.data) {
          this.rows = response.data.data.map((item) => ({
            ...item,
            totalWaterTank: item.waterLevel, // Map the correct field if needed
            deviceName: item.deviceName,
            totalWaterOutput: item.dailyOutput,
            date: item.date,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
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
