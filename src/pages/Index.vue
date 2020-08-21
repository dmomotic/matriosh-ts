<template>
  <q-page class="constrain q-pa-lg">
    <div class="row">
      <div class="col-12">
        <q-btn-group push spread>
          <q-btn
            push
            label="Traducir"
            icon="transform"
            @click="showNotif('primary','Traduccion realizada con exito')"
          />
          <q-btn push label="Ejecutar" icon="play_arrow" @click="ejecutar" />
        </q-btn-group>
      </div>
    </div>

    <!-- Editor de codigo -->
    <div class="row justify-content-center q-mt-md">
      <div class="col-12">
        <q-card class="my-card">
          <q-tabs v-model="tab" class="text-white bg-deep-orange-5">
            <q-tab label="Editor" name="editor" />
            <q-tab label="Consola" name="consola" />
            <q-tab label="AST" name="ast" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="editor">
              <codemirror v-model="code" :options="cmOptions" />
            </q-tab-panel>

            <q-tab-panel name="consola" style="height: 400px" class="bg-grey-10 text-white">
              With so much content to display at once, and often so little screen real-estate,
              Cards have fast become the design pattern of choice for many companies, including
              the likes of Google and Twitter.
            </q-tab-panel>

            <q-tab-panel name="ast" style="height: 500px">
              <ast />
            </q-tab-panel>
          </q-tab-panels>
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
// Analizador
import Analizador from "../../analizador/gramatica";

export default {
  components: {
    codemirror,
    ast: require("../components/Ast").default,
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
      output: "salida de ejemplo",
      tab: "editor",
    };
  },
  methods: {
    showNotif(variant, message) {
      this.$q.notify({
        message: message,
        color: variant,
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
    analizar() {
      try {
        this.showNotif("primary", Analizador.parse("5+40/"));
      } catch (error) {
        this.showNotif("negative", JSON.stringify(error));
      }
    },
    traducir() {},
    ejecutar() {},
  },
};
</script>

<style lang="css">
.CodeMirror {
  height: 500px;
}
</style>

