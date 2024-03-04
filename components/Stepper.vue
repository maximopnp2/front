<template>
<div class="d-flex align-center justify-space-between stepper_wrapper">
        <v-card
        flat
        v-for="(item, i) in traceArr"
        :key="item.name"
        class="d-flex justify-space-between align-center"
        >
            <v-card
            class="d-flex align-center justify-space-around"
            flat
            height="120"
            >
              <div :class="item.key === 'Cooker' ? 'mx-5 card__content':'card__content' ">
                <div style="text-align:center;" class="d-flex">
                  <div class="card_content_datetime_vacu" v-if="item.key === 'Vacushear'">
                    
                  
                    <div v-for="it in item.datetime">

                      <!-- {{it}} -->
                      {{it | formattedDate }}
                    </div>
                  </div> 


                  <div class="card_content_datetime" v-else>{{item.datetime | formattedDate }}</div> 
                    <v-tooltip
                          v-if="(item.key === 'KSM' || item.key === 'Línea') && date_alert(item.datetime,dateTime)"
                          bottom color="error">
                      <template v-slot:activator="{ on, attrs }">
                        <v-img
                          src="info.svg"
                          alt="info"
                          class="ml-1"
                          v-bind="attrs"
                          v-on="on"
                          height="24"
                        />  
                      </template>
                      <span>{{ item.key === 'KSM' ? "Elaborado" : "Envasado" }} hace mas de 24hrs</span>
                    </v-tooltip>   
                    
                  
                  </div>  
                <div style="text-align:center;">
                  <div class="my-0 card_content_name"></div>
                </div>  

                <v-img
                  :src="item.src"
                  :alt="item.name"
                  class="img__stepper"
                />      

                <div style="text-align:center;">
                  <div v-if="item.key != 'Vacushear'" class="my-0 card_content_name">{{item.name}}</div> 
                  
                  <span class="card_content_span">{{item.key}}</span>
                </div>                  
              </div>
            </v-card>

          <v-card flat height="120" class="d-flex justify-center align-center" style="min-width:100px;" v-if="i !== traceArr.length-1">
              <hr class="mx-1" style="border-top: 0.13rem dashed #7a7a7a;min-width:85px;">   
          </v-card>
        </v-card>
</div>
</template>

<script>
import moment from 'moment'
export default {
  props:{
    traceArr:{
      type:Array,
      required:true
    },
    dateTime:String
  },
  data: () => ({
  }),
  methods:{
    date_alert(line_date,req_date){
      const isAlert = moment(req_date).diff(line_date,'minutes')
      console.log ("Fecha Filtro: ", req_date)
      console.log ("Fecha Env: ", line_date)
      console.log ("Diferencia: ", isAlert)

      if(isAlert > 1440){
        return true
      }
      return false
    }
  },
  filters:{
    formattedDate(datetime){
      return moment(datetime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style>
@media (max-width: 1750px) {
  .img__stepper{
    max-height: 115px;
    max-width: 110px;
  }
  .card_content_datetime{
    text-align:center;
    font-size:1.05rem!important;
    color:#7a7a7a;
    height:40px!important;
  }
  .card_content_datetime_vacu{
    text-align:center;
    font-size:.7rem!important;
    color:#7a7a7a;
    height:40px!important;
    width: 135px;
  }
  .card_content_name{
    text-align:center;
    font-size:1rem!important;
    letter-spacing: 1px;
    font-weight: 700;
    color:#7a7a7a;
    height:15px;
    min-width:6rem;

  }
  .card_content_span{
    color:#7a7a7a;
    font-size: 1rem;
  }
}

@media (min-width: 1750px) {
  .img__stepper{
    max-height: 160px;
    max-width: 160px;
  }
  .card_content_datetime{
    text-align:center;
    font-size:1.3rem!important;
    color:#7a7a7a;
    height:30px!important;
  }
  .card_content_name{
    text-align:center;
    font-size:1.2rem!important;
    letter-spacing: 1px;
    font-weight: 700;
    color:#7a7a7a;
    height:15px;
    min-width:6rem;

  }
  .card_content_span{
    color:#7a7a7a;
    font-size: 1.2rem;
  }
}

.card__content{
  min-width:6rem;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
}
</style>