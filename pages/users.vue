<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>         
          <AgregarUsuario @click="getUser"/>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="TableData"
          :search="search"
        >
        <template v-slot:[`item.acciones`]="{ item }">
            <v-row class="d-flex justify-center" v-if="item.id != 1">
              <EditarUsuario
                :user="item"
                class="mr-2"
                @click="getUser"
              />
              <EliminarUsuario
                :user="item"
                @click="getUser"
              />
            </v-row>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import AgregarUsuario from "~/components/AgregarUsuario.vue";
import EditarUsuario from "~/components/EditarUsuario.vue";
import EliminarUsuario from "~/components/EliminarUsuario.vue";
import Cookies from 'js-cookie'
import axios from '~/plugins/axios'

  export default {
    name: "UsersPages",
    components: {
      AgregarUsuario,
      EditarUsuario,
      EliminarUsuario
    },
    data:()=> ({
        dialog:false,
        token: Cookies.get('token'),
        search: "",
        headers: [
          { text: "Nombre", align: "start", filterable: true, value: "nombre" },
          { text: "Apellido", value: "apellido" },
          { text: "Email", value: "email" },
          { text: "Acciones", value: "acciones", sortable: false, align: "center"}
        ],
        TableData: []
    
    }),
    methods: {
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
    },
    mounted() {
      this.getUser();
    }
  };
</script>
