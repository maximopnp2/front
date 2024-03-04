<template>
    <v-app>
  
      <v-app-bar
        :clipped="clipped"
        fixed
        app
        dark
        class="nav-bar"
        style="height:70px;"
      >
        <!-- LOGOS IZQUIERDA -->
        <span @click="goHome" style="cursor:pointer;">
          <img
            src="../static/logo_white.png"
            alt="Vue Material Admin"
            width="50"
            height="50"
          />        
          <img
            src="../static/Hellmanns_logo_white.png"
            alt="Vue Material Admin"
            width="70"
            height="50"
          />        
        </span>
  
  
        <!-- OPCIONES IZQUIERDA -->
        <v-spacer />
        <div>
          <v-bottom-navigation :value="value" color="blue" vertical>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn href="/sap_batch" v-bind="attrs" v-on="on">
            <span>Lista de Batchs</span>
            <v-icon>mdi-search-web</v-icon>
          </v-btn>
        </template>
        <span>Lista de todos los batchs registrados</span>
      </v-tooltip>
  
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn href="/batch_estados" v-bind="attrs" v-on="on">
            <span>Batch a chequear</span>
            <v-icon>mdi-folder-arrow-down</v-icon>
          </v-btn>
        </template>
        <span>Lista de batchs a chequear</span>
      </v-tooltip>
    </v-bottom-navigation>
  
        </div>
        <v-spacer />
    
        <!-- OPCIONES DERECHA -->
          <v-chip
          class="ma-2"
          dark
          outlined
        >         
       
          <v-img 
          src="account_circle.png" 
          alt="Vue Material Admin"
          width="24" height="24" 
          style="margin-right: 4px"
          />
                
          {{logged_user}}
        </v-chip>
        
        <opciones/>
        
      </v-app-bar>
  
      <v-main>
        <v-container fluid style="width:90%;">
          <Nuxt />
        </v-container>
      </v-main>
  
      
    </v-app>
  
    
  
  </template>
  
  <!-- 
  <template>
    <v-bottom-navigation :value="value" color="blue" vertical>
      <v-btn @click="navigateTo('search-line')">
        <span>Search Line</span>
        <v-icon>mdi-search-web</v-icon>
      </v-btn>
  
      <v-btn @click="navigateTo('trazabilidad-batch')">
        <span>Trazabilidad Batch</span>
        <v-icon>mdi-folder-arrow-down</v-icon>
      </v-btn>
  
      <v-btn @click="navigateTo('trazabilidad-lote')">
        <span>Trazabilidad Lote</span>
        <v-icon>mdi-timeline-outline</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </template> -->
  
  
  
  <script>
  import Opciones from "~/components/Layout/Menu_navabar.vue";
  import Cookies from 'js-cookie'
  
  export default {
    components:{
      Opciones
    }, 
    data () {
      return {
        clipped: true,
        drawer: false,
        fixed: true,
        items: [
          {
            icon: 'mdi-apps',
            title: 'Vista Principal',
            to: '/'
          },
          {
            icon: ' mdi-wrench',
            title: 'Administ. de Usuario',
            to: '/users'
          },
          {
            icon: ' mdi-wrench',
            title: 'Deslogin',
            to: '/'
          }
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Unilever'
      }
    },
    computed:{
      logged_user(){
        return `${Cookies.get('name')} ${Cookies.get('lastname')}`
      }
    },
    methods:{
      goHome(){
        this.$router.push('/home')
      }
    },
    searchTrazaLine() {
      console.log('Search Traza Line clicked');
  
  
  
    }
  }
  </script>
  <style scoped>
  .nav-bar{
    background:#282879!important;
  }
  
  .icon{
    color: rgb(40, 38, 38);
  }
  .v-btn {
    margin-right: 100px;
    margin-left: 100px;
    /* que se ilumine cuando le doy click */
    background: #f5f5f5;
    color: black;
  
  }
  
  .v-bottom-navigation {
    /* sacarle el fondo */
    background: none;
    
  }
  
  </style>
  