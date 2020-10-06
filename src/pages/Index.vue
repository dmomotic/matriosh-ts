<template>
  <q-page class="constrain q-pa-lg">
    <div class="row">
      <div class="col-12">
        <q-btn-group push spread>
          <q-btn push label="Traducir" icon="transform" @click="traducir" />
          <q-btn push label="Limpiar" icon="cleaning_services" @click="limpiar" />
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
            <q-tab label="Errores" name="errores" v-if="errores != null && errores.length > 0" />
            <q-tab label="Consola" name="consola" />
            <q-tab
              label="Tabla de Símbolos"
              name="tabla_de_simbolos"
              v-if="entornos != null && entornos.length > 0"
            />
            <q-tab label="AST" name="ast" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="editor">
              <codemirror v-model="code" :options="cmOptions" @input="codigoEditado" />
            </q-tab-panel>

            <q-tab-panel name="errores" v-if="errores != null && errores.length > 0">
              <div class="q-pa-md">
                <q-table
                  title="Lista de Errores Obtenidos"
                  :data="errores"
                  :columns="columns"
                  row-key="name"
                  dark
                  color="amber"
                  dense
                  :pagination="{ rowsPerPage: 0 }"
                  rows-per-page-label="Errores por página"
                />
              </div>
            </q-tab-panel>

            <q-tab-panel name="consola" class="bg-grey-10 text-white">
              <q-list dark bordered separator dense>
                <q-item
                  clickable
                  v-ripple
                  v-for="(item, index) in salida"
                  :key="index"
                >
                  <q-item-section>{{ item }}</q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="tabla_de_simbolos" v-if="entornos != null && entornos.length > 0">
              <tabla-simbolos :entornos="entornos" />
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
//JS-Beautify
var beautify_js = require('js-beautify').js_beautify
// CodeMirror
import { codemirror } from "vue-codemirror";
// import base style
import "codemirror/lib/codemirror.css";
// import theme style
import "codemirror/theme/paraiso-light.css";
// import language js
import "codemirror/mode/javascript/javascript.js";
// Analizador
import AnalizadorTraduccion from "../analizador/gramatica_traduccion";
//Traduccion
import { Traduccion } from "../traduccion/traduccion";
import { Variable } from "../traduccion/variable";
import { Ejecucion } from "../ejecucion/ejecucion";
import { Errores } from "../arbol/errores";
import { Error as InstanciaError } from "../arbol/error";
import { Entornos } from "../ejecucion/entornos";
import { EntornoAux } from '../ejecucion/entorno_aux';

export default {
  components: {
    codemirror,
    ast: require("../components/Ast").default,
    tablaSimbolos: require("../components/TablaSimbolos").default,
  },
  data() {
    return {
      code: "",
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
      salida: [],
      errores: [],
      columns: [
        { name: "tipo", label: "Tipo", field: "tipo", align: "left" },
        { name: "linea", label: "Linea", field: "linea", align: "left" },
        {
          name: "descripcion",
          label: "Descripcion",
          field: "descripcion",
          align: "left",
        },
      ],
      entornos: [],
    };
  },
  methods: {
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
    traducir() {
      if (this.code.trim() == "") {
        this.notificar("primary", `Ingrese algo de código, por favor`);
        return;
      }
      this.inicializarValores();
      try {
        const raizTraduccion = AnalizadorTraduccion.parse(this.code);
        //Validación de raiz
        if (raizTraduccion == null) {
          this.notificar(
            "negative",
            "No fue posible obtener la raíz de la traducción"
          );
          return;
        }
        let traduccion = new Traduccion(raizTraduccion);
        this.dot = traduccion.getDot();
        const codigoNuevo = traduccion.traducir();
        Entornos.getInstance().clear();
        // this.code = codigoNuevo;
        this.code = beautify_js(codigoNuevo, { indent_size: 2 });
        this.notificar("primary", "Traducción realizada con éxito");
      } catch (error) {
        this.notificar("negative", JSON.stringify(error));
      }
      this.errores = Errores.getInstance().lista;
    },
    ejecutar() {
      if (this.code.trim() == "") {
        this.notificar("primary", `Ingrese algo de código, por favor`);
        return;
      }
      this.inicializarValores();
      try {
        const raiz = AnalizadorTraduccion.parse(this.code);
        //Validacion de raiz
        if (raiz == null) {
          this.notificar(
            "negative",
            "No fue posible obtener la raíz de la ejecución"
          );
          return;
        }
        let ejecucion = new Ejecucion(raiz);
        this.dot = ejecucion.getDot();
        //Valido si puedo ejecutar (no deben existir funciones anidadas)
        if(!ejecucion.puedoEjecutar(raiz)){
          this.notificar("primary", "No se puede realizar una ejecución con funciones anidadas");
          return;
        }
        ejecucion.ejecutar();
        // ejecucion.imprimirErrores();
        this.salida = ejecucion.getSalida();
        this.notificar("primary", "Ejecución realizada con éxito");
      } catch (error) {
        this.validarError(error);
      }
      this.errores = Errores.getInstance().lista;
      this.entornos = Entornos.getInstance().lista;
    },
    inicializarValores() {
      Errores.getInstance().clear();
      Entornos.getInstance().clear();
      this.errores = [];
      this.entornos = [];
      this.salida = [];
      this.dot = '';
    },
    validarError(error) {
      const json = JSON.stringify(error);
      this.notificar(
        "negative",
        `No fue posible recuperarse de un error :(\nNo me pongan 0 por favor`
      );
      const objeto = JSON.parse(json);

      if (
        objeto != null &&
        objeto instanceof Object &&
        objeto.hasOwnProperty("hash")
      ) {
        Errores.getInstance().push(
          new InstanciaError({
            tipo: "sintactico",
            linea: objeto.hash.loc.first_line,
            descripcion: `No se esperaba el token: "${objeto.hash.token}" en la columna ${objeto.hash.loc.last_column}, se esperaba uno de los siguientes: ${objeto.hash.expected}`,
          })
        );
      }
    },
    codigoEditado(codigo){
      this.inicializarValores();
    },
    limpiar(){
      this.code = '';
      this.inicializarValores();
    }
  },
};
</script>

<style lang="css">
.CodeMirror {
  height: 500px;
}
</style>

