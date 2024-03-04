<template>
  <v-row justify="center" align="center">
    <v-col cols="12" class="px-0 my-5">
      <v-card elevation="5">
        <v-row align="center">
          <v-col cols="2">
            <v-text-field v-model="lote" label="Número de lote" outlined dense rounded hide-details
              style="margin-left: 20px;" required @input="delayedPadWithZeros" />
          </v-col>
          <v-col cols="2" class="pr-0">
            <v-dialog v-model="showDatePicker" max-width="250px">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" class="d-none"></v-btn>
              </template>
              <v-date-picker v-model="dates" range></v-date-picker>
            </v-dialog>
            <v-text-field v-model="dateRangeText" label="Filtro por Rango de fechas" prepend-icon="mdi-calendar"
              class="small-text-field" @click:prepend.stop="showDatePicker = true"></v-text-field>
          </v-col>
          <v-col cols="2" class="pr-1">
            <v-select v-model="dateFilter" :items="['Última hora', 'Hoy', 'Esta semana', 'Este mes', 'Este año']"
              label="Filtro por Fecha de carga"></v-select>
          </v-col>
          <v-col cols="2">
            <v-chip v-if="dateRangeText" close @click:close="resetDateRangeText">
              {{ dateRangeText }}
            </v-chip>
            <v-chip v-if="dateFilter" close @click:close="dateFilter = ''">
              {{ dateFilter }}
            </v-chip>
          </v-col>
          <v-col cols="4" class="prtr text-right ">
            <v-btn class="botonbus" @click="getTrace" height="80" width="80" dark color="#282879" elevation="2" outlined>
              <v-img src="magnify.png" alt="Vue Material Admin" width="50" height="50" />
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <!-- Trazabilidad -->
    <v-row justify="center" align="center">
      <v-col cols="10" class="px-0 my-5">
        <v-data-table :headers="headers" :items="filteredItems" :search="search">

          <template v-slot:item.Actions="{ item, index }">
            <v-icon @click.stop="item.showDialog = true">mdi-information</v-icon>
            <v-dialog v-model="item.showDialog" max-width="600px" background-color="#F44336">
              <v-card>
                <v-card-title>
                  Detalles del número de Batch: {{ item.batchId }}
                  <v-spacer></v-spacer>
                  <v-btn icon @click="item.showDialog = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-data-table :headers="headers2" :items="item.listaEquipos" :items-per-page="15" class="elevation-1">
                  ></v-data-table>
              </v-card>
            </v-dialog>
          </template>





          <template v-slot:item.Actions2="{ item, index }">
  <v-icon @click.stop="showBatchDetails(item.batchId, item)">mdi-file</v-icon>

  <v-dialog v-model="item.showDialog2" max-width="600px" background-color="#F44336">


              <v-card>
                <v-card-title>
                  Detalles del número de Batch: {{ item.batchId }}
                  <v-spacer></v-spacer>
                  <v-btn icon @click="item.showDialog2 = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-data-table :headers="headers3" :items="detalleLote" :items-per-page="15" class="elevation-1">
</v-data-table>

              </v-card>
            </v-dialog>
          </template>

        </v-data-table>

        <v-alert color="orange" dense shaped text type="warning" class="mt-3" :value="valert">{{ respalert }}</v-alert>
      </v-col>
      <notifier />
    </v-row>
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
      axiosResponse: null,
      isDateFilterActive: false,
      isDateRangeActive: false,
      dateFilter: null,
      userInput: '',
      timeoutId: null,
      selectedDate: null,
      showDatePicker: false,
      dates: [],
      dateRangeText: '',
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
      menuDateTime: false,
      alert: false,
      lines: [],
      lote: null,
      is_vacu: false,
      listaLote: [],
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
      detalleLote: [],
      headers: [,
        { text: 'Número de Lote', value: 'lote', sortable: false },
        { text: 'Codigo del Material', value: 'sap_mat' },
        { text: 'Nombre del material', value: 'materialNombre' },
        { text: 'Número de Batch', value: 'batchId' },
        { text: 'Detalle del Batch', value: 'Actions2', sortable: false },
        { text: 'Trazabilidad', value: 'Actions', sortable: false },


      ],
      headers2: [,
        { text: 'Desde', value: 'nombre_parent', sortable: false },
        { text: 'Hacia', value: 'nombre', sortable: false },
        { text: 'Fecha', value: 'datetime' },


      ],
      headers3: [,
        { text: 'Lote', value: 'lote', sortable: false },
        { text: 'Fecha', value: 'time_ok', sortable: false },
      ],
      carga_vacushear: [],
    }
  },
  filters: {
    parseDate(date) { // funcion para parsear la fecha
      return moment(date).format('DD-MM-YYYY HH:mm')
    },
    filter_lote_materia_prima(product_type_id) { // funcion para filtrar el tipo de lote
      if (product_type_id === 1) return 'Lotes de tomate'
      if (product_type_id === 2) return 'Lotes de aceite'
      if (product_type_id === 3) return 'Lotes de mostaza'
      return ''
    }
  },
  computed: {
    filteredItems() {
      return this.listaLote.filter(item => {
        return item.lote.includes(this.searchTerm) || item.batchId.includes(this.searchTerm);
      });
    },

    date_time() { // funcion para obtener la fecha y hora
      return moment(`${this.date} ${this.time}`).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  created() {

  },
  watch: {
    dates(newDates) {// funcion para actualizar las fechas
      this.dateRangeText = newDates.join(' ~ ');
    },
  },
  methods: {
    toggleDateFilter(isDateFilterActive) { // funcion para activar el filtro de fecha
      // si el filtro de rango de fecha esta activo y el filtro de fecha esta activo
      if (this.isDateRangeActive && !isDateFilterActive) {
        this.resetDateRangeText();
      }

      // si el filtro de rango de fecha esta activo y el filtro de fecha esta activo
      if (this.isDateFilterActive && !isDateFilterActive) {
        this.dateFilter = null;
      }

      // si el filtro de rango de fecha esta activo y el filtro de fecha esta activo
      if (this.isDateRangeActive && isDateFilterActive) {
        this.isDateRangeActive = false;
      }

      // si el filtro de fecha esta activo
      else if (this.isDateFilterActive && !isDateFilterActive) {
        this.dateRangeText = '';
        this.showDatePicker = false;
        this.dates = [];
      }

      // actualizar el estado de los botones
      this.isDateFilterActive = isDateFilterActive;

      if (isDateFilterActive) { // si el filtro de fecha esta activo
        this.dateRangeText = '';
        this.showDatePicker = false;
        this.dates = [];
      } else {
        this.dateFilter = null;
      }

      this.$nextTick(() => {  // actualizar el estado de los botones
        this.$refs.datePickerMenu.$refs.activator.disabled = !isDateFilterActive;
        this.$refs.dateFilterMenu.$refs.activator.disabled = isDateFilterActive;
      });
    },
    resetDateRangeText() { // funcion para resetear el rango de fechas
      this.dateRangeText = '';
      this.showDatePicker = false;
      this.dates = [];
    },
    updateDates() { // funcion para actualizar las fechas
      const dates = this.dateRangeText.split(' ~ ');
      if (dates.length === 2 && this.isValidDate(dates[0]) && this.isValidDate(dates[1])) {
        this.dates = dates;
      } else {
        this.dateRangeText = this.dates.join(' ~ '); // reset the text field if the dates are invalid
      }
    },
    isValidDate(dateString) { // funcion para validar la fecha
      const regEx = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateString.match(regEx)) return false;  // Invalid format
      const d = new Date(dateString);
      const dNum = d.getTime();
      if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
      return d.toISOString().slice(0, 10) === dateString;
    },
    delayedPadWithZeros() {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.padWithZeros(); // Use arrow function to bind the correct context
      }, 1000); // 1000 ms = 1 second
    },
    padWithZeros() {
      let userInput = this.lote;
      this.lote = '0';
      while (this.lote.length < 18 - userInput.length) {
        this.lote += '0';
      }
      this.lote += userInput;
    },
    ...mapMutations(['SET_NOTIFIER']), // importa la notificacion
    getRowClass(item, index) { // funcion para cambiar el color de las filas
      return { backgroundColor: this.getRowColor(index) };
    },
    getRowColor(index) { // funcion para cambiar el color de las filas
      const opacity = 1 - (index / this.listaEquipos.length);
      return `rgba(173, 216, 230, ${opacity})`; // lightblue con opacidad variable
    },

    async showBatchDetails(batchId, batchItem) {
  try {
    this.$set(batchItem, 'showDialog2', true); // Usar $set para reactividad en Vue
    console.log("Batch ID:", batchId);
    const token = Cookies.get("token");
    const response = await axios.post('/getBatchInfo', {
      batchId: batchId
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    response.data.ksmBatchData.forEach(item => {
      item.time_ok = moment(item.time_ok).format('DD-MM-YYYY HH:mm');
    });

    console.log('Response from server:', response.data);

    this.detalleLote = (response.data.ksmBatchData || []).map(item => ({
      ...item,
      showDialog2: false,
    }));
  } catch (error) {
    console.error('Error fetching batch details:', error);
  }
},

    // --------------------------------------------------------------
    async getTrace() {
      try {
        this.search = false;
        this.load = true;

        this.listaLote = [];
        this.listaEquipos = [];
        this.respalert = null;
        this.valert = false;

        const token = Cookies.get("token");

        const dataToSend = {
          dates: this.dates,
          dateFilter: this.dateFilter,
        };

        console.log('dataToSend', dataToSend);

        const response = await axios.get('/getLote', {
          params: {
            lote: this.lote,
            dates: this.dates,
            dateFilter: this.dateFilter,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        console.log('response', response);

        if (response.data.message) {
          this.respalert = response.data.message;
          this.valert = true;
        }

        if (response.data == null) {
          return response({});
        }

        if (this.listaLote == undefined) {
          this.respalert = response.data.message;
          this.valert = true;
        }

        if (response.data.loteChanged === true) {
          this.respalert = 'Número no encontrado en vacushear, se cambió a: ' + response.data.loteUsado + ' y se encontró en carga KSM';
          this.valert = true;
        }

        setTimeout(() => {
          this.valert = false;
        }, 4000);

        this.listaLote = response.data.detallesBatch.map(item => ({
          ...item,
          showDialog: false,
        }));

        this.listaEquipos = response.data.detallesBatch.map(item => ({
          ...item,
          showDialog: false,
        }));

        console.log('listaLote', this.listaLote);
        this.load = false;
        this.search = true;
      } catch (error) {
        this.load = false;
        this.search = true;
        this.respalert = 'No se encontraron registros';
        this.valert = true;
        console.error('Error getTracer', error);
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

.date-picker-button {
  font-size: 0.5rem;
  padding: 0.5rem;
  color: #fff;
  background-color: #282879;
  border-radius: 10px;
  margin-top: 0rem;
}

.d-flex.align-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.date-picker-button,
.small-btn {
  font-size: 0.4rem;
  padding: 0.3rem;
}

.v-btn {
  font-size: 0.8rem;
  padding: 0.5rem;
}

.v-text-field-lote {
  margin-right: 50px;
}

.botonbus {
  margin-right: 10px;

}
</style>  

