<template>

  <v-dialog
  v-model="dialog"
  width="500"
>
  <template v-slot:activator="{ on, attrs }">
    <v-list-item
    link
    color="#282879"      
    v-bind="attrs"
    v-on="on"
    >
      <v-list-item-action>         
        <v-img src="update.svg" alt="Vue Material Admin" width="24" height="24" />
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title v-text="'Actualizar contraseña'" />
        </v-list-item-content>
    </v-list-item>     
  </template>

  <v-card>
      <v-card-title class="headline white--text blue darken-4 mb-5">
          Cambiar contraseña
        </v-card-title>
          <v-card-text class="py-0 px-1">
            <v-form ref="form" lazy-validation v-model="valid">
              <v-container class=" px-2">
                <v-row class="px-1">
                  <v-col cols="12" class=" px-2 py-0" >
                    <v-text-field
                    v-model="register.actual_password"
                    outlined
                    rounded
                    dense
                    required
                    :rules="passwordRules" 
                    label="Contraseña actual"
                    :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    :type="showPassword ? 'password' : 'text'"
                    @click:append="showPassword = !showPassword"                                       
                    >
                  </v-text-field>
                  </v-col>
                  <v-col cols="12" class=" px-2 py-0">
                    <v-text-field
                    v-model="register.new_password"
                    outlined
                    rounded
                    dense
                    required
                    :rules="passwordRules" 
                    label="Nueva Contraseña"
                    :append-icon="showPassword2 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    :type="showPassword2 ? 'password' : 'text'"
                    @click:append="showPassword2 = !showPassword2"                                       
                    >
                  </v-text-field>
                  </v-col>
                  <v-col cols="12" class=" px-2 py-0">
                    <v-text-field
                    v-model="register.confirm_password"
                    outlined
                    rounded
                    dense
                    required
                    :rules="passwordRules" 
                    label=" Confirmar Contraseña"
                    :append-icon="showPassword3 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    :type="showPassword3 ? 'password' : 'text'"
                    @click:append="showPassword3 = !showPassword3"                                       
                    >

                    </v-text-field>
                  </v-col>                       
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
        
          <v-divider/>

  <v-card-actions class="py-1 px-2">
    <v-spacer></v-spacer>
    <v-btn color="error" text @click="hide"> Cancelar </v-btn>
    <v-btn color="primary" text @click="UpdatePassword "> Ok </v-btn>
  </v-card-actions>
  </v-card>
</v-dialog>

</template>

<script>
import axios from '~/plugins/axios'
import Cookies from 'js-cookie'
import { mapMutations } from 'vuex'
import Notifier from '~/components/Notifier.vue'
export default{

  data:()=>({
    dialog: false,
    valid: false,
    register:{
      actual:'',
      new:'',
      confirmation:''
    },
    passwordRules: [
        v => !!v || 'Campo obligatorio',
        v => (v && v.length >= 4) || 'Mínimo 4 caracteres',
      ],
      showPassword:true,
      showPassword2:true,
      showPassword3:true,
  }),

  methods:{

    async UpdatePassword(){
      
      if (this.new_password != this.confirm_password){
          this.new_password='';
          this.confirm_password='';
          this.SET_NOTIFIER({
              show:true,
              text: 'Error, la contraseña no coincide',
              color:'error',
              timeout:3000
            })
        return 
      }
      
      try {
        const token = Cookies.get('token')
        const user_id = Cookies.get('user_id')
          await axios
          .put(`users/change-password/${user_id}`,this.register, {
              headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
              this.SET_NOTIFIER({
                show:true,
                text: 'Contraseña actualizada correctamente',
                color:'primary',
                timeout:3000  
              })
              this.$emit('click')
              this.$refs.form.reset()               
            })
        } catch (error) {
          if (error.response.data){
            this.SET_NOTIFIER({
              show:true,
              text:error.response.data.message ||  'Error al actualizar la contraseña',
              color:'error',
              timeout:3000
            })
          }        
         return console.log(error);
        }
    },
    
    hide() {      
        this.$refs.form.reset()       
        this.dialog = false
      },
    ...mapMutations(['SET_NOTIFIER']),
  }

}
</script>