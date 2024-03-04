<script >
  import axios from '~/plugins/axios'
  import Cookies from "js-cookie";
  export default{

    components:{
      
    },
    
    props:{
      orden: {
        type: Object,
        required: true
      },
    },

    comments:{},

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
        { text: 'ACCIONES', value: 'acciones' },
      ],
      msg:{data:'', estado:false},
      sumaCalculada:0,
      ordenEditar:'',
      dialog: false,
      token: Cookies.get('token'),
      rol_id: null,
      matKsm:[],
      ordenMaterialesTotal:[],
      noEditOrden:true,
      listaMaterial:[],
      
      newRegistro: {
        material: '',
        lote:'',
        total:''
      },

      ModalOrden:{
        ba_id:'',
        lote:'',
        cantidad:'',
        orden:'',
        site:''
      },
      ordenMatModificada:[]

    }),

    methods:{

      async show() {
        this.dialog = true;
        this.getOrder()
      },

      async getOrder(){
          try {
            await axios
              .get(`orden/${this.orden.oguid}`, {
                headers: { Authorization: `Bearer ${this.token}` }
            })
          .then( async (res) => {
            
            this.ModalOrden = res.data.batch

            this.ordenMatModificada =  await Promise.all(res.data.resultSumaTot.map(item => {
              item.edit = true
              return item
            }))
          
            this.ordenMaterialesTotal= structuredClone(this.ordenMatModificada)
            this.ordenEditar= res.data.batch.orden

            this.ordenMaterialesTotal.forEach(it => {
                let aux = this.listaMaterial.find(el => it.sap_mat == el.sap_mat)

                if(aux ===undefined){
                  this.listaMaterial.push(it)
                }
            });
            
          });
      
      } catch (error) {
        console.log(error);
      }
      },

      cancelarEdicionOrden(){
        this.noEditOrden = true 
        this.ordenEditar = this.ModalOrden.orden
      },

      hide() {
        this.alertShow = false
        this.dialog = false
        this.noEditOrden = true 
      },

      changeIconorden(){
        this.noEditOrden = false
        this.ordenEditar = ''
      }, 
      

      async saveOrden(){

        try {
          await axios
            .put(`orden/${this.orden.oguid}`,{orden:this.ordenEditar}, {
              headers: { Authorization: `Bearer ${this.token}` }
            })
            .then(res => {
          
            });
            this.getOrder()
            this.$emit('click')  
            this.cancelarEdicionOrden() 
        } catch (error) {
          console.log(error);
        }

      },

      toogleItemMaterial(index){
        this.ordenMatModificada[index].edit = !this.ordenMatModificada[index].edit
      },

      cancelEdiMat(index){
        this.ordenMatModificada[index].edit = true
        this.ordenMatModificada[index].total = this.ordenMaterialesTotal[index].total
        this.ordenMatModificada[index].lote = this.ordenMaterialesTotal[index].lote
      },

      newItem(){

        if(this.newRegistro.lote == '' || this.newRegistro.material == '' || this.newRegistro.total == ''){
          this.msg.data ='Todos los datos son requeridos'
          this.msg.estado=true
          setTimeout(() => {
            this.msg.estado = false
          }, 2000);
          return
        }
        let matExistente =  this.ordenMatModificada.find(it => (this.newRegistro.material.sap_mat == it.sap_mat) && (this.newRegistro.lote == it.lote)  )

        if( matExistente === undefined){
          this.ordenMatModificada.push({
              sap_mat: this.newRegistro.material.sap_mat,
              desc: this.newRegistro.material.desc,
              lote: this.newRegistro.lote,
              total: this.newRegistro.total,
              backflushed:this.newRegistro.material.backflushed,
              edit:true
          })
          this.ordenMaterialesTotal.push({
              sap_mat: this.newRegistro.material.sap_mat,
              desc: this.newRegistro.material.desc,
              lote: this.newRegistro.lote,
              total: this.newRegistro.total,
              backflushed:this.newRegistro.material.backflushed,
              edit:true
          })

          this.newRegistro.lote = ''
          this.newRegistro.total= ''
          this.newRegistro.total= ''
          this.newRegistro.material = ''

        }else {
          this.msg.data = 'Lote repetido'
          this.msg.estado = true
          setTimeout(() => {
            this.msg.estado = false
          }, 2000);
          return
        
        }

      },


    },

    watch: {
      ordenMatModificada: {
        handler(newVal) {

          try {
            this.sumaCalculada = newVal.reduce((total, item) => parseFloat( total ? total : 0 ) + parseFloat(item.total ? item.total : 0), 0);
            
            this.sumaCalculada = this.sumaCalculada.toFixed(2)

          } catch (error) {
            
          }

          
        },
        deep: true
      }
    },

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
          >mdi-pencil
        </v-icon>

      </template>
      <span>Editar Orden</span>
    </v-tooltip>

    <v-dialog v-model="dialog" width="100%">
      <v-card>
        <v-card-title>
          <span class="mr-2" style="font-size:24px;">Editando batch: </span>
          <span style="font-weight: 400!important;">{{ orden.ba_id}}</span>
        </v-card-title>

        <v-card-text>
          <v-card>
            
            <v-card-title >
              <span>titulo de orden</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row class="mt-3 ">

                  <v-col cols="3" class=" py-0 px-1">
                    <div class="d-flex aling-center">
                      <!-- orden -->
                      <v-text-field 
                      v-model="ordenEditar" 
                      outlined 
                      rounded 
                      dense 
                      required 
                      ref="order"
                      type="number"
                      label="ORDEN" 
                      hide-details
                      :disabled="noEditOrden"
                      />
                      <v-icon v-if="noEditOrden" @click="changeIconorden"  >mdi-pencil</v-icon>
                      <v-icon v-if="!noEditOrden" size="20" class=" icon mr-2" @click="saveOrden" >mdi-check </v-icon>
                      <v-icon v-if="!noEditOrden" @click="cancelarEdicionOrden" size="20" class=" icon mr-2" >mdi-close-circle-outline</v-icon>
                    </div>
                  </v-col>
                  <v-col cols="3" class="py-0 px-1">
                    <!-- lote -->
                    <v-text-field 
                      outlined 
                      v-model="ModalOrden.lote" 
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
                      v-model="ModalOrden.site" 
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
            :items="ordenMatModificada" 
            :items-per-page="5" 
            class="elevation-1"
            >

            <template v-slot:[`item.acciones`]="{ index, item }">
              <v-row class="d-flex justify-center" >
                
                <v-icon v-if="ModalOrden.orden==0 "  size="20" class=" mr-2">mdi-close-circle-outline</v-icon>

                <v-icon v-if="item.edit"  size="20" class="icon mr-2" @click="toogleItemMaterial(index)">mdi-pencil</v-icon>
                <v-icon v-if="!item.edit" size="20" class="icon mr-2" @click="toogleItemMaterial(index)" >
                  mdi-check
                </v-icon>
                <v-icon v-if="!item.edit"  size="20" class=" icon mr-2" @click="cancelEdiMat(index)">mdi-close-circle-outline</v-icon>
              </v-row>
            </template>

            <template v-slot:[`item.total`]="{ item }">
              <v-row class="d-flex justify-center" >
                <v-text-field 
                  v-model="item.total"
                  dense
                  hide-details
                  :disabled="item.edit"
                  />
              </v-row>
            </template>

            <template v-slot:[`item.lote`]="{ item }">
              <v-row class="d-flex justify-center" >
                <v-text-field 
                  :disabled="item.edit"
                  v-model="item.lote"
                  dense
                  hide-details
                  />
              </v-row>
            </template>

            </v-data-table>

            
          </v-card>

            <v-card class="mt-3" v-if="orden.orden != 0">
              <v-card-title>
                <span>Agregar material</span>
               
              </v-card-title>
              <v-card-text class="pb-0">
                <v-container>
                  <v-row>

                    <v-col>
                      <v-select
                        :items="listaMaterial" 
                        item-text="desc" 
                        item-value="sap_mat" 
                        solo label="Material" 
                        return-object
                        v-model="newRegistro.material"
                        hide-details
                        >
                      </v-select>
                    </v-col>
                    
                    <v-col>
                      <v-text-field 
                        outlined 
                        rounded 
                        dense 
                        label="Lote" 
                        v-model="newRegistro.lote"
                        hide-details 
                      />
                    </v-col>
                    
                    <v-col>
                      <v-text-field 
                        v-model="newRegistro.total" 
                        outlined 
                        rounded 
                        dense 
                        label="Total" 
                        hide-details
                      />
                    </v-col>

                  </v-row>
                  
                  
                </v-container>
              </v-card-text>
              <!-- <v-card-actions class="d-flex justify-end pt-0 "> -->
              <v-card-actions class="d-flex justify-end pt-0 ">
                <v-row>
                  <v-col cols="10" sm="9" md="10" class=" py-0 mb-3 pt-1">
                    <v-alert v-if="msg.estado" dense elevation="4" outlined type="error">{{msg.data}}</v-alert>
                  </v-col>
                  <v-col cols="2" sm="3" md="2" class="py-0 mb-3 pt-1">
                    <v-btn @click="newItem" class="success">
                      Agregar
                      <v-icon>
                        mdi-checkbox-marked-circle
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                
              </v-card-actions>
            </v-card>

        </v-card-text>
        
        <v-divider />

        <v-card-actions class="py-1 px-1">
          <v-spacer></v-spacer>
          <v-btn color="error" @click="hide"> Cancelar </v-btn>
          <v-btn color="primary" > Ok </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>


  </div>
</template>

<style scoped>
  .hr__card{
  border: 2px solid #DDDDDD;
  border-radius: 5px;
  margin: 0 3px;
}
.icon {
  cursor: pointer;
}
</style>