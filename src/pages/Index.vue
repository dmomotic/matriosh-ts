<template>
  <q-page class="constrain q-pa-lg">
    <div class="row">
      <div class="col-12">
        <q-btn-group push spread>
          <q-btn push label="Traducir" icon="transform" @click="showNotif" />
          <q-btn push label="Ejecutar" icon="play_arrow" @click="analizar"/>
        </q-btn-group>
      </div>
    </div>

    <div class="row justify-content-center q-mt-md">
      <div class="col-12">
        <q-card class="my-card">
          <q-card-section class="bg-red-4 text-white">
            <div class="text-h6">Editor de Código</div>
          </q-card-section>

          <q-card-section>
            <codemirror v-model="code" :options="cmOptions" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
// CodeMirror
import { codemirror } from "vue-codemirror";
// import base style
import "codemirror/lib/codemirror.css";
// import theme style
import "codemirror/theme/paraiso-light.css";
// import language js
import "codemirror/mode/javascript/javascript.js";

import Analizador from "../../analizador/gramatica";

export default {
  components: {
    codemirror,
  },
  data() {
    return {
      code: "const a = 10",
      cmOptions: {
        tabSize: 4,
        matchBrackets: true,
        styleActiveLine: true,
        mode: "text/javascript",
        theme: "paraiso-light",
        lineNumbers: true,
        line: false,
      },
    };
  },
  methods: {
    showNotif() {
      this.$q.notify({
        message: "Traducción realizada con exito",
        color: "primary",
        multiLine: true,
        avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
        actions: [
          {
            label: "Aceptar",
            color: "yellow",
            handler: () => {
              /* ... */
            },
          },
        ],
      });
    },
    analizar(){
      console.log(Analizador.parse('5+3*8'));
    }
  },
};
</script>

<style lang="css">
.CodeMirror {
  height: 500px;
}
</style>

