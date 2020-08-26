<template>
  <q-page class="constrain q-pa-lg">
    <div class="row">
      <div class="col-12">
        <q-btn-group push spread>
          <q-btn push label="Traducir" icon="transform" @click="analizar" />
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
              {{ codigoTraducido }}
            </q-tab-panel>

            <q-tab-panel name="ast" style="height: 500px">
              <ast :dot="dot" />
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
import Analizador from "../analizador/gramatica";
//Vuex
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    codemirror,
    ast: require("../components/Ast").default,
  },
  data() {
    return {
      code:
        'let a; \nconst b = 5; \nlet d = "hola mundo"; \nconst var : string = "hola mundo esto es una prueba"; \nconsole.log(5);',
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
      dot: "",
      contadorDot: 0,
    };
  },
  methods: {
    ...mapMutations("traduccion", ["AGREGAR_CODIGO"]),
    notificar(variant, message) {
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
        const raiz = Analizador.parse(this.code);
        this.contadorDot = 0;
        this.dot = "digraph G {";
        this.generarAstDot(raiz);
        this.dot += "}";
        this.notificar("primary", "Operación realizada con éxito");
      } catch (error) {
        this.notificar("negative", JSON.stringify(error));
      }
    },
    generarAstDot(nodo) {
      if (nodo instanceof Object) {
        let idPadre = this.contadorDot;
        this.dot += `node${idPadre}[label="${nodo.label}"];\n`;
        if (nodo.hasOwnProperty("hijos")) {
          nodo.hijos.forEach((nodoHijo) => {
            if (nodoHijo instanceof Object) {
              let idHijo = ++this.contadorDot;
              this.dot += `node${idPadre} -> node${idHijo};\n`;
              this.generarAstDot(nodoHijo);
            } else {
              let idHijo = ++this.contadorDot;
              this.dot += `node${idPadre} -> node${idHijo};\n`;
              this.dot += `node${idHijo}[label="${nodoHijo}"];`;
            }
          });
        }
      }
    },
    traducir() {},
    ejecutar() {

    },
  },
  computed: {
    ...mapState("traduccion", ["codigoTraducido"]),
  },
};
</script>

<style lang="css">
.CodeMirror {
  height: 500px;
}
</style>

