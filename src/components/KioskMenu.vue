<template>
  <!-- kioskMenu -->
  <div
    class="
      kioskMenu
      w-1/4
      px-4
      fixed
      top-0
      h-full
      bg-neutral
      flex flex-col
      text-white
      ease-linear
      duration-100
      z-20
    "
    :class="showMenu ? 'right-0' : '-right-1/4'"
  >
    <!-- header -->
    <div class="header w-full py-4 bg-zinc flex items-center justify-between">
      <p class="text-xl font-bold">Configuración</p>
      <div class="close-icon w-6 h-6 cursor-pointer" @click="toggleMenu(false)">
        <img src="/assets/icons/close-outline.svg" alt="close" />
      </div>
    </div>
    <!-- body -->
    <div class="body overflow-auto flex-1">
      <div class="section-divider py-4 mb-4 border-b border-gray-600">
        <p>Impresión de tickets</p>
      </div>
      <label for="printer">
        <p class="text-sm mb-2">Impresora:</p>
      </label>
      <select
        name="printer"
        id="printer"
        class="w-full text-black p-2 rounded-md outline-none"
        @change="setPrinter($event.target.value)"
      >
        <option selected="true" disabled>Seleccione Una</option>
        <option
          v-for="(printer, index) in printers"
          :key="index"
          :value="printer.name"
        >
          {{ printer.displayName }}
        </option>
      </select>

      <!-- Print Test -->
      <input
        class="w-full py-2 text-black rounded-md mt-4"
        type="button"
        value="Imprimir Ticket Prueba"
        @click="printTest()"
      />
    </div>
    <!-- quit app -->
    <div
      class="
        quit
        py-6
        border-t border-gray-600
        border-b border-gray-600
        flex
        justify-between
        cursor-pointer
      "
      @click="closeApp()"
    >
      <p>Cerrar App</p>
      <div
        class="icon w-5 h-5 bg-white"
        :style="'-webkit-mask-image: url(/assets/icons/power-outline.svg); -webkit-mask-repeat: no-repeat; -webkit-mask-position: center;'"
      ></div>
    </div>

    <!-- app version -->
    <div class="appVersion text-center py-4">
      <p>GAF Kiosk v{{appVersion}}</p>
    </div>

    <!-- TOAST FOR CONFIG CHANGES -->
    <Toast ref="toast" />
  </div>
</template>

<script lang="ts">
//set electron
const { electron } = window as any;

//custom components
import Toast from "@/components/Toast.vue";

import { defineComponent } from "vue";

export default defineComponent({
  name: "KioskMenu",
  data() {
    return {
      appVersion: "",
      showMenu: false,
      printers: [] as any[any],
    };
  },
  components: {
    Toast,
  },
  mounted() {
    //get app version
    electron.send("app_version");
    electron.on("app_version", (arg: any[any]) => {
      this.appVersion = arg[0].version
    })

    //get printers
    electron.send("getPrinters");
    electron.on("receivePrinters", (arg: any) => {
      this.printers = arg[0];
    });
  },
  methods: {
    toggleMenu(status: boolean) {
      this.showMenu = status;
    },
    setPrinter(selectedPrinter: string) {
      this.$store.commit("setPrinter", selectedPrinter);
      const toast = this.$refs.toast as any;
      toast.show("Se cambió la impresora a: " + this.$store.state.printer);
    },
    printTest() {
      const toast = this.$refs.toast as any;
      if (this.$store.state.printer !== "") {
        electron.send("print", this.$store.state.printer);
      } else {
        toast.show("Primero debe seleccionar una impresora");
      }
    },
    closeApp() {
      electron.send("closeApp");
    },
  },
});
</script>
