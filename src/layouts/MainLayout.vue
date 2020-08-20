<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          MatriosTS
        </q-toolbar-title>

        <div>Diego Momotic - 201318633</div>
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  data () {
    return {

    }
  }
}
</script>
