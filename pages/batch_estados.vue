 <template>
  <v-row >
    <v-col cols="12"  md="12" class="px-0 my-5">
      <v-card elevation="5">
        <v-card-title class="pb-2 ">
          TABLA DE BATCH CON ESTADOS A CHEQUEAR
        </v-card-title>
        <hr class="hr__card">
        <v-data-table 
          :loading=load
          loading-text="Cargando datos..."
          :headers="headers" 
          :items="listOrder" 
          :items-per-page="5" 
          class="elevation-1"
        >
        <template v-slot:[`item.acciones`]="{ item }">
          <v-row  class="d-flex justify-center"  v-if="listOrder.indexOf(item) == 0" >
            <ModalEdit :orden="item" @click="getOrders" />
          </v-row>
        </template>
        </v-data-table>

      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ModalEdit from '~/components/ModalProduccion.vue';
import axios from "../plugins/axios";
import Cookies from "js-cookie";
import { mapMutations } from "vuex";

  export default {
    layout: "navSap",
    middleware: "NOAUTH",
    components:{
      ModalEdit
    },
    data () {
      return {
        load:false,
        token: Cookies.get('token'),
        headers: [
          {
            text: 'ORDEN',
            align: 'start',
            sortable: false,
            value: 'orden',
          },
          { text: 'LOTE', value: 'lote' },
          { text: 'PRODUCTO', value: 'producto' },
          { text: 'CANTIDAD', value: 'cantidad' },
          { text: 'BATCH', value: 'ba_id' },
          { text: 'ESTADO', value: 'estado' },
          { text: 'FECHA', value: 'datetime' },
          { text: "ACCIONES", value: "acciones", sortable: false, align: "center" }
        ],
        listOrder: [],
      }
    },
    filters:{
      
    },
    computed:{
      
    },
    created(){
      this.getOrders()
    },
    methods:{
      
      ...mapMutations(['SET_NOTIFIER']),
    
      async getOrders(){
        this.load=true
        try {
          await axios
            .get("orden", {
              headers: { Authorization: `Bearer ${this.token}` }
            })
            .then(res => {
              this.listOrder = res.data.orden;
              this.load = false
            });
        } catch (error) {
          console.log(error);
          this.load = false
        }
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

</style>
