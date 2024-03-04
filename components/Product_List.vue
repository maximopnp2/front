<template>
  <v-item-group v-model="selected" mandatory>
    <v-row>
      <v-col v-for="(item, i) in products" :key="i" cols="12" value="id" md="4">
        <v-item v-slot="{ active, toggle }">
          <v-img :src="active && !item.disabled ? item.src : item.disabledSrc"
            :class="active && !item.disabled ? 'text-center pa-2 product card_product' : 'text-center pa-2 product'"
            @click="item.disabled ? null : toggle">
            <v-btn icon dark v-show="!item.disabled">
              <v-icon color="info" size="50" class="mt-7">
                {{ active ? "mdi-check-circle" : "" }}
              </v-icon>
            </v-btn>
          </v-img>
        </v-item>
      </v-col>
    </v-row>
  </v-item-group>
</template>

<script>
import axios from 'axios'; // Asegúrate de tener axios instalado

export default {
  data: () => ({
    products: [
      {
        id: 1,
        src: "ketchup.png",
        disabledSrc: "ketchup_grey_scale.png",
        disabled: false // ketchup es seleccionable
      },
      {
        id: 2,
        disabledSrc: "mayonesa_grey_scale.png",
        disabled: true // mayonesa no es seleccionable
      },
      {
        id: 3,
        disabledSrc: "mostaza_grey_scale.png",
        disabled: true // mostaza no es seleccionable
      },
    ],
    selected: 0
  }),
  methods: {
    customToggle() {
      this.$emit("ProductId", this.products[this.selected]);
      console.log(this.products[this.selected].id);

      // Enviar el ID del producto seleccionado a tu backend
      axios.post('http://127.0.0.1:3333/getProduct', {
        productId: this.products[this.selected].id
      })
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  watch: {
    selected() {
      this.customToggle();
    }
  }
};
</script>

<style scoped>
.product {
  height: 95px !important;
  width: 180px;
}

div:disabled {
  -webkit-filter: grayscale(100%);
  /* Safari 6.0 - 9.0 */
  filter: grayscale(100%);
}

.card_product {
  border: 6px solid rgb(56, 88, 251);
  border-radius: 40px;

}
</style>
