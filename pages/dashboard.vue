<template>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          Opciones
        </v-btn>
      </template>
  
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" @click="handleClick(item)">
          <v-list-item-title>{{ item }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </template>
  
  <script>
  export default {
    data() {
      return {
        items: ['Opción 1', 'Opción 2', 'Opción 3']
      }
    },
    methods: {
      handleClick(item) {
        console.log(`Has seleccionado: ${item}`);
      }
    },
    layout (context) {
    return 'blog'
  }
  }
  </script>