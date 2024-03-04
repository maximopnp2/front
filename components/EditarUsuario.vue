<template>
  <div>
    <v-tooltip bottom>         
      <template v-slot:activator="{ on, attrs }">
          <v-icon
          v-bind="attrs"
          v-on="on"
          @click="show"
          >mdi-pencil
          </v-icon>
      </template>
      <span>Editar usuario</span>
    </v-tooltip>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="white--text" style="background:#282879;">
          <span class="mr-2" style="font-size:24px;">Editando usuario: </span>   
          <span style="font-weight: 400!important;">{{ user.nombre}} {{user.apellido}}</span>
        </v-card-title>

        <v-card-text class="py-1">
          <v-form ref="form" lazy-validation v-model="valid">
            <v-container class="py-1 px-1">
              <v-row class="mt-3">
                <v-col cols="6"  class="py-0 px-1">
                  <v-text-field
                  v-model="usuario.nombre"
                  outlined
                  rounded
                  dense                  
                  required
                  :rules="rules"
                  label="Nombre"                  
                  />
                </v-col>

                <v-col cols="6" class="py-0 px-1">
                  <v-text-field
                  v-model="usuario.apellido"
                  outlined
                  rounded
                  dense
                  required
                  :rules="rules"
                  label="Apellido"                  
                  />
                </v-col>

                <v-col cols="12" class="py-0 px-1">
                  <v-text-field
                  v-model="usuario.email"
                  outlined
                  rounded
                  dense
                  required
                  :rules="emailRules"                            
                  label="Email"
                  />
                </v-col>

                <v-col cols="12" class="py-0 px-1">
                  <v-text-field
                  v-model="usuario.password"
                  outlined
                  rounded
                  dense
                  label="Contraseña"
                  :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  :type="showPassword ? 'password' : 'text'"
                  @click:append="showPassword = !showPassword"
                  />
                </v-col>
              </v-row>
      
              <v-row>
                <v-col cols="12" md="6" class="pb-0" align-self="center">
                  <v-checkbox
                    v-model="rol"
                    label="Administrador"
                    class="mt-0"
                  />
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                  <v-text-field
                  v-model="usuario.session_time"
                  type="number"
                  step="1"
                  min="2"
                  outlined
                  rounded
                  dense                      
                  required
                  :rules="sessionRules"
                  label="Duración de sesión(min)"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-divider/>

        <v-card-actions class="py-1 px-1">
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="hide"> Cancelar </v-btn>
          <v-btn color="primary" text @click="putUsuario"> Ok </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- NOTIFIACIONES -->
    <notifier class="notifier__css"/>
  </div>
</template>
  
<script>
  import axios from '~/plugins/axios'
  import Cookies from 'js-cookie'
  import Notifier from '~/components/Notifier.vue'
  import { mapMutations } from 'vuex'
  
  export default{
    props:{
      user: {
        type:Object,
        required:true
      },   
    },

    components: {
      Notifier
    },
    data:()=>({
      passwordRules: [
        v => !!v || 'Campo obligatorio',
        v => (v && v.length >= 4) || 'Mínimo 4 caracteres',
      ],
      sessionRules: [
        v => !!v || 'Campo obligatorio',
        v => (v && v >= 2) || 'Mínimo 2 minutos',
      ],
      rules:[v => !!v || 'Campo obligatorio'],
      emailRules: [
        v => !!v || 'Campo obligatorio',
        v => /.+@.+\..+/.test(v) || 'E-mail inválido',
      ],
      showPassword:true,
      token: Cookies.get('token'),
      dialog: false,
      valid: false,
      alertShow: false,
      alertMsg: '',
      alertType: 'success',
      token: Cookies.get('token'),
      rol:0,
      usuario: {
        nombre: '',
        apellido: '',
        email:'',          
        rol_id:'1',
        password:'',
        rol_id:0,
        session_time:2
      }
    }),
  
    methods:{
      async show(){
        this.dialog = true;
        this.getUsuario();
      },

      hide() {      
        this.$refs.form.reset()
        this.alertShow = false
        this.dialog = false
      },

      async getUsuario(){
        try {
          await axios
            .get(`users/${this.user.id}`, {
              headers: { Authorization: `Bearer ${this.token}` }
            })
            .then(res => {              
              this.usuario = res.data;   
              this.usuario.password=''; 
              this.usuario.rol_id == 1 ? this.rol = true : this.rol = false;                        
            });  
            console.log(this.user.id)          
        } catch (error) {
          console.log(error);
        }
      },

      async putUsuario(){
        try {
          if (this.$refs.form.validate()) {
            this.rol ? this.usuario.rol_id = 1 : this.usuario.rol_id = 0;
            await axios
            .put(`users/${this.user.id}`,this.usuario, {
                headers: { Authorization: `Bearer ${this.token}` }
              })
              .then(res => {
                this.SET_NOTIFIER({
                  show:true,
                  text:'Usuario actualizado correctamente',
                  color:'primary',
                  timeout:3000  
                })
                this.$emit('click')
                this.hide()
            })
          }
        } catch (error) {
          this.SET_NOTIFIER({
              show:true,
              text:error.response.data.message || 'Error al modificar el Usuario',
              color:'error',
              timeout:3000
            })
          console.log(error);
        }
      },
      ...mapMutations(['SET_NOTIFIER']),
  
    }
  }
</script>
  
<style scoped>
</style>