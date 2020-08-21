<template>
  <div id="panzoom-element" v-html="grafica"></div>
</template>

<script>
//Panzoom
import Panzoom from "@panzoom/panzoom";
//Viz
import Viz from "viz.js";
import { Module, render } from "viz.js/full.render.js";
let viz = new Viz({ Module, render });

export default {
  data() {
    return {
      panzoom: null,
      grafica: "",
    };
  },
  beforeDestroy() {
    let item = document.getElementById("panzoom-element");
    item?.removeEventListener("scroll", this.scrollHandler);
    item?.parentElement?.removeEventListener('wheel', this.panzoom.zoomWithWheel);
  },
  mounted() {
    let item = document.getElementById("panzoom-element");
    item.addEventListener("scroll", this.scrollHandler);
    this.panzoom = Panzoom(item, {
      maxScale: 2,
    });
    //Zoom with mouse's wheel
    item.parentElement.addEventListener('wheel', this.panzoom.zoomWithWheel)
    const dot = `
        digraph G {

          subgraph cluster_0 {
            style=filled;
            color=lightgrey;
            node [style=filled,color=white];
            a0 -> a1 -> a2 -> a3;
            label = "process #1";
          }

          subgraph cluster_1 {
            node [style=filled];
            b0 -> b1 -> b2 -> b3;
            label = "process #2";
            color=blue
          }
          start -> a0;
          start -> b0;
          a1 -> b3;
          b2 -> a3;
          a3 -> a0;
          a3 -> end;
          b3 -> end;

          start [shape=Mdiamond];
          end [shape=Msquare];
        }
      `;
    viz
      .renderString(dot)
      .then((element) => {
        let codigo = element.substring(
          element.indexOf("<svg"),
          element.lastIndexOf(">") + 1
        );
        this.grafica = codigo;
      })
      .catch((error) => {
        // Create a new Viz instance (@see Caveats page for more info)
        viz = new Viz({ Module, render });

        // Possibly display the error
        console.error(error);
      });
  },
  methods: {
    scrollHandler(e) {
      console.log(e);
    },
  },
};
</script>
