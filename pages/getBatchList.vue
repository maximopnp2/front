<template>
  <v-row justify="center" align="center">
    <v-col cols="12" class="px-0 my-5">
      <v-card elevation="5">
        <div class="px-3">
          <v-row align="center">
              <v-col cols="7" class="py-1">
                <product-list />
              </v-col>
          </v-row>
        </div>
      </v-card>
    </v-col>
    <!-- -------------------------------------------------------------- -->

    <!-- Trazabilidad -->

    <v-col cols="10" class="px-0 my-5">
      <v-data-table :headers="headers" :items="filteredBatches" :search="search">
        <template v-slot:item.ksm_ba_id="{ item }">
          {{ item.ksm_ba_id }}
          <v-icon @click.stop="getBatchDetails(item.ksm_ba_id); item.showDialog = true"> mdi-file-search-outline</v-icon>
          <v-dialog v-model="item.showDialog" max-width="600px" background-color="#F44336">
            <v-card>
              <v-card-title>
                Detalles del Batch ID: {{ item.batchId }}
                <v-spacer></v-spacer>
                <v-btn icon @click="item.showDialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-data-table :headers="headers2" :items="listaEquipos" :items-per-page="15" class="elevation-1">
                ></v-data-table>
            </v-card>
          </v-dialog>
        </template>
      </v-data-table>
      <v-alert color="orange" dense shaped text type="warning" class="mt-3" :value="valert">{{ respalert }}</v-alert>
    </v-col>

    <notifier />
  </v-row>
</template>
    
<script>
import ProductList from '~/components/Product_List.vue';

import Notifier from '~/components/Notifier.vue';
import axios from "../plugins/axios";
import Cookies from "js-cookie";
import moment from "moment"
import { mapMutations } from "vuex";
export default {
  middleware: "NOAUTH",
  layout: "navNew",
  components: {
    ProductList,

    Notifier
  },
  data() {
    return {
      searchTerm: '',
      selectedBatchId: null,
      darkMode: false,
      searchTerm: '',
      singleExpand: true,
      valert: false,
      respalert: null,
      valid: true,
      search: true,
      load: false,
      date: moment().format('YYYY-MM-DD'),
      time: moment().format('HH:mm'),
      menuDate: false,
      menuTime: false,
      lines: [],
      batchId: null,
      is_vacu: false,
      listaBatch: [],
      img_srcs: {
        'env': 'env.png',
        'tolvin': 'tolvin.png',
        'collector': 'collector.png',
        'lung': 'lung.png',
        'cooker': 'cooker.png',
        'ksm': 'ksm.png',
        'vacushear': 'carga_vacushear.png'
      },
      listaEquipos: [],
      headers: [,
        { text: 'Batch ID', value: 'ksm_ba_id', sortable: false },
        { text: 'Acciones', value: 'actions', sortable: false },
        { text: 'Material ID', value: 'sap_mat' },
        { text: 'pv', value: 'pv' },
        { text: 'Lote', value: 'lote', sortable: false },
        { text: 'Data Time', value: 'time_ok', sortable: false }
      ],
      headers2: [,
        { text: 'Nombre', value: 'nombre', sortable: false },
        { text: 'Fecha', value: 'datetime' },
        { text: 'Vino desde', value: 'nombre_parent', sortable: false },

      ],
      carga_vacushear: [],
    }
  },
  filters: {
    parseDate(date) {
      return moment(date).format('DD-MM-YYYY HH:mm')
    },
    filter_lote_materia_prima(product_type_id) {
      if (product_type_id === 1) return 'Lotes de tomate'
      if (product_type_id === 2) return 'Lotes de aceite'
      if (product_type_id === 3) return 'Lotes de mostaza'
      return ''
    }
  },
  computed: {
    filteredBatches() {
    if (!this.searchTerm) {
      return this.listaBatch;
    }
    this.getTrace(this.searchTerm);
    return this.listaBatch;
  },
    header_lote_materia_prima: function () {
      let header = ''
      switch (this.product_type_id) {
        case 1:
          header = 'Lotes de tomate'
          break
        case 2:
          header = 'Lotes de aceite'
          break
        case 3:
          header = 'Lotes de mostaza'
          break
      }
      return header
    },

    date_time() {
      return moment(`${this.date} ${this.time}`).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  created() {
    this.getTrace();
  },
  methods: {
    captureBatchId(batchId) {
      this.selectedBatchId = batchId;
      console.log("Batch ID seleccionado: ", batchId);
    },
    ...mapMutations(['SET_NOTIFIER']),
    getRowClass(item, index) {
      return { backgroundColor: this.getRowColor(index) };
    },
    getRowColor(index) {
      const red = Math.min(255, index * 10);  // Ajusta el factor de multiplicación según tus necesidades
      return `rgb(${red}, 0, 0)`;  // Devuelve un color en formato RGB
    },
    getRowColor(index) {
      const opacity = 1 - (index / this.listaEquipos.length);
      return `rgba(173, 216, 230, ${opacity})`; // lightblue con opacidad variable
    },
    openDialog(item) {
      this.listaBatch.forEach(i => {
        i.showDialog = false;
      });
      item.showDialog = true;
    },

    // --------------------------------------------------------------

    async getTrace(batchId) {

      try {

        this.search = false;
        this.load = true;

        const token = Cookies.get("token");

        const response = await axios.get('/getBatch', {
          params: { batchId: this.batchId },
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        this.listaBatch = response.data.responseData;

        this.listaBatch.forEach((item) => {
          item.showDialog = false;
        });

        console.log(this.listaBatch)

        this.search = true;
        this.load = false;

      } catch (error) {

        return console.log('error getTracer', error);
      }
    },

    async getBatchDetails(batchId) {
      try {
        this.search = false;
        this.load = true;

        const token = Cookies.get("token");

        console.log(batchId)

        const response = await axios.get('/getBatchDate', {
          params: { batchId: batchId, is_vacu: false },
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        this.listaEquipos = response.data.listaEquipos.map(item => ({
          ...item,
          showDialog: false,
        }));

        console.log(this.batchDetails)

        this.search = true;
        this.load = false;

      } catch (error) {
        return console.log('error getBatchDetails', error);
      }
    },


  }

}
</script>
    
<style>
.table__css {
  height: 15rem;
  overflow-y: scroll;
}


.table_header {
  font-size: 15px;
  font-style: bold;
}


th td {
  font-size: 50px !important;
}

.hr__card {
  border: 2px solid #DDDDDD;
  border-radius: 5px;
  margin: 0 3px;
}

.stepper_wrapper {
  margin: 40px 0;
  max-width: 100%;
}

.row-color-even {
  background-color: lightblue;
}

.row-color-odd {
  background-color: lightgreen;
}

.v-data-table {
  width: 100%;
  height: 500px;
}

.v-data-table table {
  width: 100%;
  height: 100%;

}

.v-card {
  width: 100%;
  height: 100%;
}

.v-card-title {
  text-align: center;
}

.dark-mode {
  background-color: #333;
  color: #fff;
}
</style>  