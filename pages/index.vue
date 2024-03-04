<template>
  
  <v-row justify="center" align="center">
    
    <v-col cols="12" class="px-0 my-5">
      
      <v-card elevation="5">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <div class="px-3">
            <v-row align="center">

              <v-col cols="7" class="py-1">
                <product-list @ProductId="getProductID"/>
              </v-col>

              <v-col cols="4">
                <!-- Linea -->
                <v-autocomplete
                  v-model="selected_line_id"
                  :items="lines"
                  label="Línea"
                  clearable
                  outlined
                  dense
                  rounded
                  item-text="nombre"
                  item-value="id"
                  disable-lookup
                  hide-details
                  class="pb-1"
                  required
                  @click:clear="clear"
                  :rules="rules"
                />
                <!-- Fecha y hora -->
                <v-row align="center" class="pt-1">
                  <v-col cols="7">
                    <v-menu
                      v-model="menuDate"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="date"
                          label="Fecha"
                          prepend-inner-icon="mdi-calendar"
                          readonly
                          outlined
                          dense
                          rounded
                          hide-details
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="date"
                        @input="menuDate = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="5">
                      <v-menu
                        ref="menu"
                        v-model="menuTime"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="time"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="time"
                            label="Hora"
                            prepend-inner-icon="mdi-clock-time-four-outline"
                            readonly
                            outlined
                            dense
                            rounded
                            hide-details
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="menuTime"
                          v-model="time"
                          full-width
                          @click:minute="$refs.menu.save(time)"
                        ></v-time-picker>
                      </v-menu>
                    </v-col>
                </v-row>
              </v-col>

              <v-col cols="1" class="pl-0 d-flex justify-end">
                <v-btn 
                @click="getTrace" 
                height="80" 
                width="80" 
                dark color="#282879" 
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
        </v-form>
      </v-card>
    </v-col >
    <!-- Trazabilidad -->
    <v-col cols="12" v-show="traceArr.length > 0" class="px-0 mt-3 mb-8 mr-10 stepper_wrapper">
      <v-card class="d-flex align-center justify-center stepper_wrapper" flat>
        <stepper :traceArr="traceArr" :dateTime="date_time"/>
      </v-card>
    </v-col>

    <v-card elevation="5" style="width:100%;min-height:324px;margin-bottom:25px;">
      <!-- Lotes tomates y Vacu -->
      <v-col class="d-flex justify-center align-center" style="width:100%;min-height:324px;" v-if="traceArr.length === 0" >
        <v-chip class="ma-2" >
          NO HAY DATOS
        </v-chip>
      </v-col>
      <v-col cols="12" v-show="traceArr.length > 0" >
        <v-row>
          <v-col cols="12" md="12">
            <v-card>
              <v-card-title class="pb-2 " >
               CARGAS KSM
              </v-card-title>

              <hr class="hr__card">

              <v-data-table
                :headers="headers_cargas_ksm"
                :items="lotes_materia_prima"
                no-data-text="No se encontraron datos"
                :footer-props="{
                'items-per-page-options':[15],
                'disable-items-per-page': true,
                }"
                class="table__css"
              >          
                <!-- <template v-slot:[`header.lote`] class="pa-0">
                  {{headers_cargas_ksm}}
                </template> -->
                <template v-slot: [`item.time_ok`]="{ item }" class="pa-0">
                  {{item.time_ok | parseDate}}
                </template>
                <!-- Alineamos el paginado a la izquierda -->
                <template v-slot:[`footer.prepend`]>
                  <v-spacer/>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
              <v-col cols="12" md="12">
                <v-card >
                  <v-card-title class="pb-2">
                    CARGAS VACUSHEAR
                  </v-card-title>
    
                  <hr class="hr__card">
    
                  <v-data-table
                    :headers="headers_cargas_vacushear"
                    :items="carga_vacushear"
                    no-data-text="No se encontraron datos"
                    :footer-props="{
                    'items-per-page-options':[15],
                    'disable-items-per-page': true,
                    }"
                    class="table__css"
                  >          
                    <template v-slot: [`item.time_ok`]="{ item }" class="pa-0">
                      {{item.time_ok | parseDate}}
                    </template>
                    <!-- Alineamos el paginado a la izquierda -->
                    <template v-slot:[`footer.prepend`]>
                      <v-spacer/>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
              <v-col cols="12" md="12">
                <v-card >
                  <v-card-title class="pb-2">
                    PREPESADA
                  </v-card-title>
    
                  <hr class="hr__card">
    
                  <v-data-table
                    :headers="headers_prepesadas"
                    :items="prepesadas"
                    no-data-text="No se encontraron datos"
                    :footer-props="{
                    'items-per-page-options':[15],
                    'disable-items-per-page': true,
                    }"
                    class="table__css"
                  >          
                    <template v-slot: [`item.time_ok`]="{ item }" class="pa-0">
                      {{item.time_ok | parseDate}}
                    </template>
                    <!-- Alineamos el paginado a la izquierda -->
                    <template v-slot:[`footer.prepend`]>
                      <v-spacer/>
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>

        </v-row>
      </v-col>
    </v-card>

    <!-- NOTIFICACIONES -->
    <notifier/>
  </v-row>
</template>

<script>
import ProductList from '~/components/Product_List.vue';
import Stepper from '~/components/Stepper.vue';
import Notifier from '~/components/Notifier.vue';
import axios from "../plugins/axios";
import Cookies from "js-cookie";
import moment from "moment"
import { mapMutations } from "vuex";
  export default {
    middleware: "NOAUTH",
    layout: "navNew",
    components:{
      ProductList,
      Stepper,
      Notifier
    },
    data () {
      return {
        valid:true,
        search:true,
        load:false,
        rules: [
          v => !!v || 'Campo obligatorio'
        ],        
        date: moment().format('YYYY-MM-DD'),
        time:moment().format('HH:mm'),
        menuDate:false,
        menuTime:false,
        lines:[],
        selected_line_id:null,
        traceArr:[],
        product_type_id:1,
        img_srcs:{
          'env':'env.png',
          'tolvin':'tolvin.png',
          'collector':'collector.png',
          'lung':'lung.png',
          'cooker':'cooker.png',
          'ksm':'ksm.png',
          'vacushear':'carga_vacushear.png'
        },
        eq_names:{
          'env':'Línea',
          'tolvin':'Tolvin',
          'collector':'Colector',
          'lung':'Pulmón',
          'cooker':'Cooker',
          'ksm':'KSM',
          'vacushear':'Vacushear'
        },
        headers_cargas_ksm: [
          { text: 'KSM BATCH ID', value: 'ksm_ba_id', sortable:false},
          { text: 'MATERIAL', value: 'material.nombre', sortable:false },
          { text: 'SKU', value: 'material.sku', sortable:false },
          { text: 'LOTE', value: 'lote', sortable:false },
          { text: 'CANTIDAD', value: 'pv', sortable:false, align:'center'},
        ],
        lotes_materia_prima: [],
        headers_cargas_vacushear: [
          { text: 'VACU BATCH ID', value: 'vacu_ba_id', sortable: false },
          { text: 'MATERIAL', value: 'material.nombre', sortable: false },
          { text: 'SKU', value: 'material.sku', sortable: false },
          { text: 'LOTE', value: 'lote', sortable: false },
          { text: 'CANTIDAD', value: 'pv', sortable: false, align: 'center' },
        ],
        prepesadas: [],
        headers_prepesadas: [
          { text: 'VACU BATCH ID', value: 'vacu_ba_id', sortable: false },
          { text: 'BATCH SIFRA', value: 'batch_sifra', sortable: false },
        ],
        carga_vacushear: [],
      }
    },
    filters:{
      parseDate(date){
        return moment(date).format('DD-MM-YYYY HH:mm')
      },
      filter_lote_materia_prima(product_type_id) {
        if(product_type_id === 1) return 'Lotes de tomate'
        if(product_type_id === 2) return 'Lotes de aceite'
        if(product_type_id === 3) return 'Lotes de mostaza'
        return ''
      }
    },
    computed:{
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
            header =  'Lotes de mostaza'
            break
        }
        return header
      },
      date_time(){
        return moment(`${this.date} ${this.time}`).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    created(){
      this.getLines()
    },
    methods:{
      ...mapMutations(['SET_NOTIFIER']),
      async getTrace(){        
        if (!this.selected_line_id){
          return  this.SET_NOTIFIER({
            show: true,
            text: 'Seleccionar Linea para ver la trazabilidad',
            color: 'primary',
            timeout: 3000
          })
        }
        try {
          this.search= false,
          this.load= true
          
          if(this.$refs.form.validate()){
              const token = Cookies.get("token");
              await axios.get('tracking', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                product_type_id:this.product_type_id,
                date_time: this.date_time,
                eq_id: this.selected_line_id,
              },
            })
            .then((res)=>{
            this.traceArr = []
            this.lotes_materia_prima = res.data.carga_ksm//.filter(lote => lote.lote > 0)
            this.carga_vacushear = res.data.carga_vacushear
            this.prepesadas = res.data.prepesadas
            const trace = res.data.trace
            this.load = false
            this.search = true
            console.log('trace:', trace)
            if(Object.values(trace).length > 0){
              for (const key in trace) {
                this.traceArr.push({name:trace[key].name, src:this.img_srcs[key], key:this.eq_names[key],datetime:trace[key].datetime})
              }  
              this.loading = false;
              console.log('this.traceArr:', this.traceArr)          
            } else {
              this.search = true
              this.load = false;
              this.SET_NOTIFIER({
                show:true,
                text:'No se encontró ningún resultado',
                color:'primary',
                timeout:3000
                })
              }
            })            
          }
        } catch (error) {
          this.search = true
          this.load = false
          console.log(error.response)
          if(error.response){
            this.SET_NOTIFIER({
              show:true,
              text:error.response.data.message,
              color:'error',
              timeout:3000
            })
          }
          return console.error('GET_TRACE_ERROR:', error)
        }
      },
      async clear(){
        await this.$refs.form.reset()
        this.traceArr = []
        this.carga_ksm = []
        this.carga_vacushear = []
        this.prepesadas = []
        this.date = moment().format('YYYY-MM-DD')
        this.time = moment().format('HH:mm')
      },
      async getLines(){
        try {
          const token = Cookies.get("token");
          await axios.get('lines', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((res)=>{
          this.lines = res.data.lines
        })
        } catch (error) {
          return console.error('GET_LINES_ERROR:', error)
        }
      },
      getProductID(product_id){
        this.product_type_id = product_id.id
        console.log('ProductId:', product_id.id)
      }
    }
  }
</script>

<style>
.table__css{
  height: 15rem;
  overflow-y: scroll;
}
.table_header{
  font-size: 15px;
  font-style: bold;
}
th td { 
  font-size: 50px!important; 
}
.hr__card{
  border: 2px solid #DDDDDD;
  border-radius: 5px;
  margin: 0 3px;
}
.stepper_wrapper{
margin: 40px 0;
max-width: 100%;
}
</style>