import "./assets/styles/tailwind.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEye,
  faPenToSquare,
  faTrash,
  faBackward,
  faPlus,
  faArrowRight,
  faArrowLeft,
  faArrowUp,
  faArrowDown,
  faShareFromSquare,
  faCopy,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faEye,
  faPenToSquare,
  faTrash,
  faBackward,
  faPlus,
  faArrowRight,
  faArrowLeft,
  faArrowUp,
  faArrowDown,
  faShareFromSquare,
  faCopy,
  faXmark

);

const app = createApp(App);
const pinia = createPinia();
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(pinia);
app.use(router);
app.mount("#app");
