<script>
  import axios from '~/plugins/axios'
  import Cookies from "js-cookie";
  export default {

    props: {
      orden: {
        type: Object,
        required: true
      },
    },

    data:()=>({
      headers: [
        { text: 'MATERIAL', value: 'sap_mat' },
        { text: 'DESCRIPCION', value: 'desc' },
        {
          text: 'LOTE',
          align: 'start',
          sortable: false,
          value: 'lote',
        },
        { text: 'TOTAL', value: 'total' },
        { text: 'BACKFLASH', value: 'backflushed' },
        
      ],
      token: Cookies.get('token'),
      dialog: false,
      sumaCalculada: 0,
      infoBatch:{},
      materialBatch:[]
    }),

    methods: {
      async show() {
        this.dialog = true;
        this.getOrder()
      },
      hide() {
        this.dialog = false
      },
      async getOrder() {
      try {
        await axios
          .get(`orden/${this.orden.oguid}`, {
            headers: { Authorization: `Bearer ${this.token}` }
          })
          .then(async (res) => {
            this.infoBatch = res.data.batch
            this.materialBatch = res.data.resultSumaTot
          });

      } catch (error) {
        console.log(error);
      }
    },

    },
    watch: {
      materialBatch: {
        handler(newVal) {

          try {
            this.sumaCalculada = newVal.reduce((total, item) => parseFloat(total ? total : 0) + parseFloat(item.total ? item.total : 0), 0);

            this.sumaCalculada = this.sumaCalculada.toFixed(2)

          } catch (error) {

          }


        },
        deep: true
      }
    }
  }
</script>

<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on,attrs }">
        <v-icon
          v-bind="attrs"
          v-on="on"
          @click="show"
        >mdi-information-slab-circle
        </v-icon>
      </template>
      <span>Información de Batch</span>
    </v-tooltip>
    <v-dialog v-model="dialog" width="100%">
      <v-card>
        <v-card-title>
          <span class="mr-2" style="font-size:24px;">Batch: </span>
          <span style="font-weight: 400!important;">{{orden.ba_id}}</span>
        </v-card-title>
      
        <v-card-text>
          <v-card>
      
            <v-card-title>
              <span>titulo de orden</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row class="mt-3 ">
      
                  <v-col cols="3" class=" py-0 px-1">
                    <div class="d-flex aling-center">
                      <!-- orden -->
                      <v-text-field 
                        v-model="infoBatch.orden"
                        outlined 
                        rounded 
                        dense 
                        required 
                        ref="order" 
                        type="number"
                        label="ORDEN" 
                        hide-details 
                        disabled 
                      />
                    </div>
                  </v-col>
                  <v-col cols="3" class="py-0 px-1">
                    <!-- lote -->
                    <v-text-field 
                      v-model="infoBatch.lote"
                      outlined 
                      rounded 
                      dense 
                      disabled 
                      label="LOTE" 
                      hide-details 
                    />
                  </v-col>
                  <v-col cols="3" class="py-0 px-1">
                    <!-- cantidad -->
                    <v-text-field 
                      v-model="sumaCalculada" 
                      outlined 
                      rounded 
                      dense 
                      disabled 
                      label="CANTIDAD" 
                      hide-details 
                    />
                  </v-col>
                  <v-col cols="3" class="py-0 px-1">
                    <!-- site -->
                    <v-text-field  
                      v-model="infoBatch.site"
                      outlined 
                      rounded 
                      dense 
                      disabled 
                      label="SITE" 
                      hide-details 
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider />
          </v-card>
      
          <v-card class="mt-3">
            <v-card-title>
              Total de materiales
            </v-card-title>
            <hr class="hr__card">
            <v-data-table 
              :headers="headers" 
              :items="materialBatch" 
              :items-per-page="5" 
              class="elevation-1">
            </v-data-table>
          </v-card>

        </v-card-text>
        <v-divider />
      
        <v-card-actions class="py-1 px-1">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="hide"> Ok </v-btn>
        </v-card-actions>
      
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
</style>