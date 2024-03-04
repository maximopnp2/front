<template>
  <v-row justify="center" align="center">
    <v-col cols="12" class="px-0 my-5">
      <v-card elevation="5">
        <div class="px-3">
          <v-row align="center">
            <v-col cols="7" class="py-1">
              <product-list />
            </v-col>

            <v-col cols="4">
              <div class="d-flex align-center">
                <v-text-field
                  v-model="batch_id"
                  label="Número de batch"
                  outlined
                  dense
                  rounded
                  hide-details
                  class="pb-1"
                  required
                />
              </div>
            </v-col>

            <!-- Boton buscar -->
            <v-col cols="1" class="pl-0 d-flex justify-end">
              <v-btn
                @click="getTrace"
                height="80"
                width="80"
                dark
                color="#282879"
                elevation="2"
                outlined
              >
                <v-img
                  src="magnify.png"
                  alt="Vue Material Admin"
                  width="50"
                  height="50"
                  v-if="search"
                />
                <v-img
                  v-if="load"
                  src="loading.gif"
                  alt="Vue Material Admin"
                  width="70"
                  height="70"
                />
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-col>

    <!-- Trazabilidad -->
    <v-col cols="10" class="px-0 my-5">
      <v-data-table
        :headers="headers"
        :items="listaEquipos"
        :items-per-page="10"
        :item-class="getRowClass"
        class="elevation-1"
      >
        <template v-slot:item.nombre_parent="{ item }">
          <!-- "Desde" column -->
          <div>
            {{ item.nombre_parent }}
          </div>
        </template>
        <template v-slot:item.nombre="{ item }">
          <!-- "Hacia" column -->
          <div>
            {{ item.nombre }}
            <v-icon v-if="isFromVacushear(item.nombre)" color="success">
              mdi-arrow-right
            </v-icon>
          </div>
        </template>
      </v-data-table>
      <v-alert
        color="orange"
        dense
        shaped
        text
        type="warning"
        class="mt-3"
        :value="valert"
      >{{ respalert }}</v-alert>
    </v-col>
  </v-row>
</template>

<script>
import ProductList from '~/components/Product_List.vue';
import Notifier from '~/components/Notifier.vue';
import axios from "../plugins/axios";
import Cookies from "js-cookie";
import moment from "moment";
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
      batch_id: null,
      is_vacu: false,
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
      headers: [
        { text: 'Desde', value: 'nombre_parent', sortable: false },
        { text: 'Hacia', value: 'nombre', sortable: false },
        { text: 'Fecha', value: 'datetime' },
      ],
      carga_vacushear: [],
    };
  },
  filters: {
    parseDate(date) {
      return moment(date).format('DD-MM-YYYY HH:mm');
    },
    filter_lote_materia_prima(product_type_id) {
      if (product_type_id === 1) return 'Lotes de tomate';
      if (product_type_id === 2) return 'Lotes de aceite';
      if (product_type_id === 3) return 'Lotes de mostaza';
      return '';
    }
  },
  computed: {
    header_lote_materia_prima: function () {
      let header = '';
      switch (this.product_type_id) {
        case 1:
          header = 'Lotes de tomate';
          break;
        case 2:
          header = 'Lotes de aceite';
          break;
        case 3:
          header = 'Lotes de mostaza';
          break;
      }
      return header;
    },
    date_time() {
      return moment(`${this.date} ${this.time}`).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  created() {},
  methods: {
    ...mapMutations(['SET_NOTIFIER']),
    isFromVacushear(direction) {
      // Add your logic to determine if it's coming from Vacushear based on the direction.
      // Return true if it's coming from Vacushear, false otherwise.
      // You can adjust this logic based on your actual data.
      return direction === 'Vacushear';
    },
    getRowClass(item, index) {
      return { backgroundColor: this.getRowColor(index) };
    },
    getRowColor(index) {
      const opacity = 1 - index / this.listaEquipos.length;
      return `rgba(173, 216, 230, ${opacity})`; // lightblue con opacidad variable
    },
    async getTrace() {
      try {
        this.search = false;
        this.load = true;
        const token = Cookies.get("token");
        const response = await axios.get('/getBatchDate', {
          params: { batchId: this.batch_id, is_vacu: this.is_vacu },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Ajusta la estructura de la respuesta según lo que devuelve tu backend
        this.listaEquipos = response.data.listaEquipos;

        if (this.listaEquipos == undefined) {
          this.respalert = response.data.message;
          this.valert = true;
        }

        setTimeout(() => {
          this.valert = false;
        }, 3000);

        this.load = false;
        this.search = true;
      } catch (error) {
        this.load = false;
        this.search = true;
        return console.log('error getTracer', error);
      }
    }
  }
};
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
  font-size: 50px!important;
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
</style>
