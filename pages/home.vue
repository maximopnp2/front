<template class="template1">
    <v-row>
        <v-col cols="6">

            <v-card class="mx-auto my-12" max-width="374" @click="reserve">
                <template slot="progress">
                    <v-progress-linear color="deep-purple" height="10" indeterminate></v-progress-linear>
                </template>

                <v-img height="390" src="logosap.png"></v-img>

                <div class="divClass">
                    <v-btn class="text1" align="center"  :loading="loading">Trazabilidad</v-btn>
                </div>

                <v-card-text>
                    <v-row align="center" class="mx-0">
                    </v-row>
                </v-card-text>

            </v-card>
        </v-col>
        <v-col cols="6">
            <v-card class="mx-auto my-12" max-width="374" @click="reserve2">
                <template slot="progress">
                    <v-progress-linear color="deep-purple" height="10" indeterminate></v-progress-linear>
                </template>

                <v-img height="390" src="logosap.png"></v-img>

                <div class="divClass2">
                    <v-btn class="text2"  :loading="loading2">Declaración SAP</v-btn>
                </div>
                <v-card-text>
                    <v-row align="center" class="mx-0">
                    </v-row>
                </v-card-text>

            </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    layout: 'default',
    data: () => ({
        loading: false,
        loading2: false,
        selection: 1,
        selectedOption: null,
        options: ['Mayonesa', 'Ketchup', 'Mostaza'],
        images: {
            'Mayonesa': 'mayonesa.png',
            'Ketchup': 'ketchup.png',
            'Mostaza': 'mostaza.png',
            'MayonesaBW': 'mayonesa_grey_scale.png',
            'KetchupBW': 'ketchup_grey_scale.png',
            'MostazaBW': 'mostaza_grey_scale.png',
        },
        selectedOption: null,
    }),

    computed: {
        selectedImage() {
            return this.images[this.selectedOption];
        },
    },


    methods: {
        selectOption(option) {
            this.selectedOption = option;
        },
        reserve() {
            this.loading = true;
            setTimeout(() => {

                this.$router.push('/')
                this.loading = false
            }, 1500)
        },
        reserve2() {
            this.loading2 = true;
            setTimeout(() => {

                this.$router.push('/sap_batch')
                this.loading = false
            }, 1500)
        },
    },
};
</script>

<style scoped>
.rounded-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

.selected-img {
    border: 6px solid blue;

}


.boton1 {
    margin-left: 130px;
    margin-right: 100px;
    color: black;
    border: 2px solid rgb(161, 161, 161);
    margin-top: 30px;
    margin-bottom: 30px;
    color: black;
    font-weight: bold;
    font-size: 15px;
}

.text1 {
    background-color: #f5f5f5;
    font-size: 25px;
    font-weight: bold;
    border-radius: 40px;
    text-align: center;
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.2);

    transition: 0.3s;
    cursor: pointer;

}

.divClass {
    text-align: center;
    margin-left: 67px;
    margin-right: 95px;


}

.divClass2 {
    text-align: center;
    margin-left: 43px;
    margin-right: 95px;


}


.text2 {
    background-color: #f5f5f5;
    font-size: 25px;
    font-weight: bold;
    border-radius: 40px;
    text-align: center;
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    cursor: pointer;
}

.v-card {
    background-color: #ffffff;
    border-radius: 40px;
    box-shadow: 0 15px 20px 0 rgba(0, 0, 0, 0.2);
    /* hacer el borde que sea con movimiento*/
    border: 2px solid rgb(0, 0, 0);

}
</style>