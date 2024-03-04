<template>
  <v-menu v-model="menu" :close-on-content-click="true" :nudge-width="200">

    <template v-slot:activator="{ on, attrs }">


      <v-btn dark v-bind="attrs" v-on="on" icon height="40" width="40">
        <v-img src="menu.png" alt="Vue Material Admin" width="24" height="24" />
      </v-btn>


    </template>



    <v-card>


      <v-list>
        <v-subheader>MENÚ</v-subheader>

        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact color="#282879">

          <v-list-item-action>
            <img :src="item.icon" alt="Vue Material Admin" width="24" height="24">
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>

        </v-list-item>



        <new-pass />

        <v-divider></v-divider>
        <v-divider></v-divider>

        <!-- LOGOUT ITEM -->
        <v-list-item link color="#282879" @click="logout()">
          <v-list-item-action>
            <v-img src="logout.svg" alt="Vue Material Admin" width="24" height="24" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'Cerrar sesión'" />
          </v-list-item-content>

        </v-list-item>
      </v-list>
    </v-card>



  </v-menu>
</template>

<script>
import NewPass from "~/components/NewPassword.vue";
import { mapActions } from "vuex";
export default {
  data: () => ({
    menu: false,
    color: 'indigo',
    items: [
      {
        icon: "home2024.svg",
        title: "Home",
        to: "/home"
      },
      {
        icon: "account_group.svg",
        title: "Adm. usuarios",
        to: "/users"
      },

    ],

  }),

  components: {
    NewPass
  },

  methods: {
    ...mapActions(["SET_LOGOUT", "INITIAL_SET_AUTH"]),
    logout() {
      this.SET_LOGOUT();
    }
  },
  mounted() {
    this.INITIAL_SET_AUTH()
  }
};
</script>

<style></style>
