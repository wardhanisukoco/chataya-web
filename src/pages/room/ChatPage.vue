<template>
  <q-page class="flex flex-center">
    <!-- <div class="q-pa-md row justify-center"> -->
    <div style="width: 100%; max-width: 360px">
      <q-chat-message
        v-for="message in messages"
        :key="message.id"
        :text="[message.content]"
        :sent="message.sessionId == sessionId"
      />
    </div>
    <!-- </div> -->
  </q-page>
  <q-footer reveal elevated>
    <q-toolbar>
      <!-- <q-toolbar-title>Footer</q-toolbar-title> -->

      <q-form @submit="onSubmit" @reset="onReset" style="width: 100%">
        <q-input
          dense
          outlined
          rounded
          v-model="content"
          standout="bg-white text-black"
        >
          <!-- <template v-slot:append>
            <q-icon name="send" size="2rem" />
          </template> -->

          <template v-slot:after>
            <q-btn
              @click="onSubmit"
              size="1.2rem"
              round
              dense
              flat
              color="white"
              icon="send"
            />
          </template>
        </q-input>
      </q-form>
    </q-toolbar>
  </q-footer>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
// import ActionCable from "actioncable";
import { io } from "socket.io-client";

export default defineComponent({
  name: "IndexPage",
  setup() {
    const $q = useQuasar();
    const $route = useRoute();
    const id = $route.params.id;
    const messages = ref([]);
    const content = ref(null);
    const sessionId = ref(null);

    // const baseURL =
    //   process.env.NODE_ENV == "development"
    //     ? "ws://localhost:3333/cable"
    //     : "wss://chataya-api.herokuapp.com/cable";
    // const cable = ActionCable.createConsumer(baseURL);

    const socketURL =
      process.env.NODE_ENV == "development"
        ? "http://localhost:3333"
        : "wss://chataya.prod";

    // Connect to server
    const socket = io(socketURL);

    const loadData = () => {
      api
        .get(`/rooms/${id}/messages`)
        .then((response) => {
          messages.value = response.data.messages.reverse();
          sessionId.value = response.data.sessionId;
        })
        .catch(() => {
          $q.notify({
            color: "negative",
            position: "top",
            message: "Loading failed",
            icon: "report_problem",
          });
        });
    };
    const onSubmit = () => {
      if (!content.value) {
        return;
      }
      api
        .post(`/rooms/${id}/messages`, {
          content: content.value,
        })
        .then((response) => {
          content.value = null;
          $q.notify({
            color: "positive",
            position: "top",
            message: "Message send.",
          });
        })
        .catch(() => {
          $q.notify({
            color: "negative",
            position: "top",
            message: "Save failed",
            icon: "report_problem",
          });
        });
    };
    onMounted(() => {
      loadData();
    });

    // cable.subscriptions.create(
    //   {
    //     channel: "RoomChannel",
    //     room: id,
    //   },
    //   {
    //     connected: () => {
    //       // console.log("connected");
    //     },
    //     disconnected: () => {
    //       // console.log("disconnected");
    //     },
    //     received: (data) => {
    //       messages.value.push(data.message);
    //       if (sessionId.value != data.message.session_id) {
    //         $q.notify({
    //           color: "positive",
    //           position: "top",
    //           message: "New message.",
    //         });
    //       }
    //     },
    //   }
    // );

    // Subscribe to room (mimicking Action Cable)
    socket.emit("subscribe", { channel: "RoomChannel", room: id });

    // Connected callback
    socket.on("connected", () => {
      // console.log("connected")
    });

    // Disconnected callback
    socket.on("disconnected", () => {
      // console.log("disconnected")
    });

    // Received callback
    socket.on("received", (data) => {
      messages.value.push(data.message);
      if (sessionId.value != data.message.sessionId) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "New message.",
        });
      }
    });
    return { messages, sessionId, content, loadData, onSubmit };
  },
});
</script>
