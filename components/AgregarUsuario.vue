<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn @click="dialog = true" color="#282879" dark class="mb-2 px-1" v-bind="attrs" outlined v-on="on" height="50"
          width="50" style="min-width:50px;">
          <v-icon class="px-1">mdi-account-multiple-plus</v-icon>
          <!-- <v-img class="px-1" src="group_add.svg" alt="Font Count_add" width="25" height="25" /> -->
        </v-btn>
      </template>
      <span>Agregar usuario</span>
    </v-tooltip>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline white--text" style="background:#282879;">
          Agregar usuario
        </v-card-title>
        <v-card-text class="py-1">
          <v-form ref="form" lazy-validation v-model="valid">
            <v-container class="py-1 px-1">
              <v-row class="mt-3">
                <v-col cols="6" class="py-0 px-1">
                  <v-text-field v-model="register.nombre" outlined rounded dense required :rules="rules" label="Nombre" />
                </v-col>

                <v-col cols="6" class="py-0 px-1">
                  <v-text-field v-model="register.apellido" outlined rounded dense required :rules="rules"
                    label="Apellido" />
                </v-col>

                <v-col cols="12" class="py-0 px-1">
                  <v-text-field v-model="register.email" outlined rounded dense required :rules="emailRules"
                    label="Email" />
                </v-col>

                <v-col cols="12" class="py-0 px-1">
                  <v-text-field v-model="register.password" outlined rounded dense required :rules="passwordRules"
                    label="Password" :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    :type="showPassword ? 'password' : 'text'" @click:append="showPassword = !showPassword" />
                </v-col>

                <v-col cols="12" class="py-0 px-1">

 
                  <v-select
                    v-model="selectedRole"
                    :items="items"
                    :error-messages="errors"
                    label="Rol"
                    data-vv-name="select"
                    required
                  ></v-select>


                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6" class="pb-0" align-self="center">
                  <v-checkbox v-model="rol" label="Administrador" class="mt-0" />
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                  <v-text-field v-model="register.session_time" type="number" step="1" min="2" outlined rounded dense
                    required :rules="sessionRules" label="Duración de sesión(min)" />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="hide"> Cancelar </v-btn>
          <v-btn color="primary" text @click="AgregarUsuario"> Ok </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- NOTIFIACIONES -->
    <notifier class="notifier__css" />
  </div>
</template>

<script>

import axios from '~/plugins/axios'
import Cookies from 'js-cookie'
import Notifier from '~/components/Notifier.vue'
import { mapMutations } from 'vuex'

export default {
  componets: {
    Notifier
  },

  data: () => ({
    selectedRole: null,
    items: [
        'Operador',
        'Operador Avanzado',
        'Supervisor',
        'Jerarquicos',
      ],
    passwordRules: [
      v => !!v || 'Campo obligatorio',
      v => (v && v.length >= 4) || 'Mínimo 4 caracteres',
    ],
    sessionRules: [
      v => !!v || 'Campo obligatorio',
      v => (v && v >= 2) || 'Mínimo 2 minutos',
    ],
    rules: [v => !!v || 'Campo obligatorio'],
    emailRules: [
      v => !!v || 'Campo obligatorio',
      v => /.+@.+\..+/.test(v) || 'E-mail inválido',
    ],
    showPassword: true,
    token: Cookies.get('token'),
    dialog: false,
    valid: false,
    rol: 0,
    register: {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      rol_id: 0,
      session_time: 2
    }
  }),

  methods: {

    async AgregarUsuario() {
  try {
    if (this.$refs.form.validate()) {
      // Asignar el valor de selectedRole a rol_id
      this.register.rol_id = this.selectedRole === 'Administrador' ? 1 : 0;

      await axios.post('register', this.register, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .then(() => {
        this.SET_NOTIFIER({
          show: true,
          text: 'Usuario agregado correctamente',
          color: 'primary',
          timeout: 3000
        })
        this.$emit('click')
        this.hide()
      });
    }
  } catch (error) {
    this.SET_NOTIFIER({
      show: true,
      text: error.response.data.message || 'No se pudo agregar el usuario',
      color: 'error',
      timeout: 3000
    });

    console.error('ERROR_Method_AgregarUsuario', error);
  }
},


    ...mapMutations(['SET_NOTIFIER']),

    hide() {
      this.$refs.form.reset()
      this.dialog = false
    },
    async getUser() {
      try {
        await axios
          .get("users", {
            headers: { Authorization: `Bearer ${this.token}` }
          })
          .then(res => {
            this.TableData = res.data.data.data;
          });
      } catch (error) {
        console.log(error);
      }
    }

  }
}
</script>

<style>
.notifier__css {
  position: fixed;
  bottom: 0;
}
</style>