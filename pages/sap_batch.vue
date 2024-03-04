<script >
  import axios from "../plugins/axios";
  import Cookies from "js-cookie";
  import InfoBatch from "~/components/BatchInfo"
  import moment from "moment"
  export default {

    layout: "navSap",
    components: {
      InfoBatch
    },

    data() {
    return {
      listBatch: [],
      search: '',
      load: false,
      token: Cookies.get('token'),
      date_desde: moment().format('YYYY-MM-DD'),
      date_hasta: moment().format('YYYY-MM-DD'),
      iconfilter: false,
      nameIcon: 'mdi-filter-outline',
      menuDate: false,
      menuDate2: false,
      headers: [
        { text: 'ORDEN', align: 'start', sortable: false, value: 'orden', filterable: false},
        { text: 'LOTE', value: 'lote' },
        { text: 'PRODUCTO', value: 'producto'},
        { text: 'CANTIDAD', value: 'cantidad', filterable: false },
        { text: 'BATCH', value: 'ba_id' },
        { text: 'ESTADO', value: 'estado' },
        { text: 'FECHA', value: 'datetime', filterable: false },
        { text: "ACCIONES", value: "acciones", sortable: false, align: "center" , filterable: false}
      ],
        
      }
    },
    created() {
      this.getListBatchs()
    },

    methods: {

      async getListBatchs() {
      this.load = true

      try {

        await axios.get("/list_batch", {
          headers: { Authorization: `Bearer ${this.token}` },
          params: {
            filtro: this.iconfilter,
            date: {
              desde: this.date_desde,
              hasta: this.date_hasta
            }
          },
        })
          .then(res => {
            this.listBatch = res.data.batchs
            this.load = false
          })
      } catch (error) {
        console.log(error);
        this.load = false
      }
    }, 

    ChangeIcon() {
      this.iconfilter = !this.iconfilter

      if (this.iconfilter == true) {
        this.nameIcon = 'mdi-filter-remove-outline'
      }
      if (this.iconfilter == false) {
        this.nameIcon = 'mdi-filter-outline'
      }

      this.getListBatchs()
    }
    }

  }

</script>

<template>
  <v-row>
    <v-col cols="12" md="12" class="px-0 my-5">
      <v-card elevation="5">
        <v-card-title class="pb-2 d-flex flex-column align-stretch">
          <span>Tabla de batch</span>
          <v-row class="my-3 ">
            <v-col cols="4">
              <div>
                <h6>FILTRO DE FECHA</h6>
                <v-menu v-model="menuDate" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                  offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="date_desde" label="Desde" prepend-inner-icon="mdi-calendar" readonly outlined
                      dense rounded hide-details v-bind="attrs" v-on="on" />
                  </template>
                  <v-date-picker v-model="date_desde" @input="menuDate = false">
                  </v-date-picker>
                </v-menu>
                <v-menu v-model="menuDate2" :close-on-content-click="false" :nudge-right="40"
                  transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="date_hasta" label="Hasta" prepend-inner-icon="mdi-calendar" readonly outlined
                      dense rounded hide-details v-bind="attrs" v-on="on" class="mt-4" />
                  </template>
                  <v-date-picker v-model="date_hasta" @input="menuDate2 = false">
                  </v-date-picker>
                </v-menu>
              </div>
            </v-col>
            <v-col cols="2" class=" d-flex align-center justify-start">
              <v-btn @click="ChangeIcon" dark>
                <v-icon dark>
                  {{ nameIcon }}
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="6" class=" d-flex align-center ">
              <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details outlined
                dense rounded />
            </v-col>
          </v-row>
        </v-card-title>
        <hr class="hr__card">
        <v-data-table :loading=load :headers="headers" :items="listBatch" :search="search" :items-per-page="5"
          loading-text="Cargando datos..." class="elevation-1">
          <template v-slot:[`item.acciones`]="{ item }">
            <v-row class="d-flex justify-center">
              <InfoBatch :orden="item" />
            </v-row>
          </template>
        </v-data-table>

      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.hr__card {
  border: 2px solid #DDDDDD;
  border-radius: 5px;
  margin: 0 3px;
}
</style>