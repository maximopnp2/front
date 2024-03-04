<template>
  <v-snackbar
    v-model="show"
    :value="true"
    absolute
    bottom
    multi-line
    :color="notifier_data.color"
    text
    :timeout="notifier_data.timeout"
    class="notifier__css"
  >
    <div style="text-align:center;font-size:18px;">{{ notifier_data.text }}</div>
    
  </v-snackbar>
</template>

<script>
import { mapState } from "vuex";
export default {
  data:()=>({
    show:false
  }),
  computed:{
    ...mapState(['notifier_data']),
  },
  watch:{
    notifier_data(){
      this.showNotifier()
    }
  },
  methods:{
    showNotifier(){
      this.notifier_data.show ? this.show = true : this.show = false
      setTimeout(function(){
        this.show=false
      }, this.notifier_data.timeout)
    }
  }
}
</script>

<style>
.notifier__css{
  z-index: 1000;
}
</style>