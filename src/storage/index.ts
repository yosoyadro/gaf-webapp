//create store
import { createStore } from 'vuex'

//vuex persist
//import vuexPersistance from 'vuex-persist';

const storage = createStore({
    state: {
        cinemaInfo: {},
        printer: '',
        cart: {}
    },
    mutations: {
        setPrinter(state, data) {
            state.printer = data
        },
        setCinemaInfo(state, data) {
            state.cinemaInfo = data
        },
        setCart(state, data) {
            state.cart = data
        }
    }
    /*,
    plugins:[
        new vuexPersistance({
            storage: window.localStorage
        }).plugin
    ]*/
})

export default storage