<template>
  <v-app class="login">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4 lg4 xl3>
          <v-card class="elevation-1 pa-3">
            <v-card-text class="pa-2 mb-1" >
              <div class="layout column align-center mb-4">
                <h1 class="flex blue-grey--text">TRAZABILIDAD ADEREZOS</h1>
              </div>
              <div class="layout column align-center mb-10">
                <img
                  src="../static/logo.png"
                  alt="Vue Material Admin"
                  width="200"
                  height="200"
                />
              </div>
              <v-form v-model="valid" ref="form" lazy-validation >
                <div class="d-flex">
                  <img
                    src="../static/person.svg"
                    alt="user"
                    width="40"
                    height="40"
                    class="mr-3"
                  />
                  <v-text-field
                    v-model="email"
                    name="email"
                    label="Email"
                    type="text"
                    outlined
                    rounded
                    dense
                    :rules="[rules]"
                  />               
                </div>
                <div class="d-flex">
                  <img
                    src="../static/key.svg"
                    alt="user"
                    width="40"
                    height="40"
                    class="mr-3"
                  />
                  <v-text-field
                    v-model="password"
                    name="password"
                    label="Password"
                    id="password"
                    outlined
                    rounded
                    dense
                    :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    :type="showPassword ? 'password' : 'text'"
                    @click:append="showPassword = !showPassword"
                    :rules="[(v) => !!v || 'Campo requerido']"
                    @keyup.enter="login()"
                  />                 
                </div>

              </v-form>
              <v-alert v-model="dialog" text type="error" dense class="pa-2" style="border-radius:3px;">
                {{ alertError }}
              </v-alert>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :loading="btnIngresar"
                dark
                block
                rounded
                id="btn__login"
                @click="login()"
                >Login</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import { mapMutations } from 'vuex'
import axios from '../plugins/axios'
import Cookies from 'js-cookie'
export default {
  layout: 'login',
  middleware: 'AUTH',
  data: () => ({
    showPassword:true,
    valid:false,
    btnIngresar: false,
    dialog: false,
    email: '',
    password: '',
    alertError: '',
    input_type:false,
    rules: (value) => !!value || 'Este campo es obligatorio',
  }),

  methods: {
    ...mapMutations(['SET_AUTH']),
    setPasswordVisible(){
      this.input_type = !this.input_type
    },
    async login() {
      if(this.verifyConnetion()){
        await axios
          .post('login', { email: this.email, password: this.password })
          .then((res) => {
            let token = res.data.token
            let logged_user = res.data.user
            logged_user.token = token
            this.SET_AUTH(logged_user)
          })
          .catch((error) => {
            if(error.response){
              this.alertError = error.response.data.message
              this.dialog = true
            }
            return console.log(error)
          })        
      }
    },

     async verifyConnetion() {
       await axios
         .get('/')
         .then((res) => {
           return true
         })
         .catch((error) => {
           this.alertError = 'No hay conexión con el servidor'
           this.dialog = true
           this.btnIngresar = true
           return false
         })
     },
  },
}
</script>

<style scoped lang="css" >
.login {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  background: #282879;
}
#btn__login {
  background: #282879;
}

.mdi-eye::before {
  cursor: pointer;
}
</style>