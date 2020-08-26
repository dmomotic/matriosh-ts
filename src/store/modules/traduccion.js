export default {
  namespaced: true,
  state: {
    codigoTraducido: 'Codigo traducido'
  },
  mutations: {
    AGREGAR_CODIGO(state, payload){
      state.codigoTraducido += payload;
    },
    LIMPIAR_CODIGO(state){
      state.codigoTraducido = '';
    }
  },
  actions: {

  },
  getters: {

  }
}
