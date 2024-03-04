<template>
  <div>    
    <v-icon @click="dialog=true"> mdi-delete </v-icon>    
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title class="headline blue darken-4 white--text">
            Eliminar usuario
          </v-card-title>
  
          <v-card-subtitle class="mt-5 Subtitle 1">
              <h3>¿Está seguro de que desea eliminar el usuario:<strong class="error--text"> {{user.nombre}}</strong> ?</h3>         
          </v-card-subtitle>
  
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="hide">
              Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text @click="deleteUser">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <notifier class="notifier__css"/>
  </div>
</template>

<script>
import axios from '~/plugins/axios'
import Cookies from 'js-cookie'
import { mapMutations } from 'vuex'
import Notifier from '~/components/Notifier.vue'

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
    dialog: false,
    token: Cookies.get('token'),
  }),

  methods: {
    hide(){   
      this.dialog = false;
      this.$emit('click');
    },
    
    async deleteUser(){    
      try {
        await axios
        .delete(`users/${this.user.id}`, {
              headers: { Authorization: `Bearer ${this.token}` }
            })
        .then(()=>{
          this.dialog = false;          
          this.SET_NOTIFIER({
                show:true,
                text:'Usuario eliminado correctamente',
                color:'primary',
                timeout:3000  
              })
          this.$emit('click')
        })
      } catch (error) {
        this.SET_NOTIFIER({
              show:true,
              text:error.response.data.message || 'Error al Eliminar el Usuario',
              color:'error',
              timeout:3000
            })
        console.log(error)
      }
    },

    ...mapMutations(['SET_NOTIFIER']),
  }

}
</script>