<template>
  <q-page class="flex flex-center">
    <div class="row">
      <div class="col-12 col-md">
        <q-card class="my-card" v-ripple @click="gotoCreateRoom">
          <q-card-section class="row justify-center">
            <div>
              <q-icon name="create" size="4em" color="grey"> </q-icon>
            </div>
          </q-card-section>
          <q-card-actions class="text-bold text-subtitle2 my-text flex-center">
            Create Room
          </q-card-actions>
        </q-card>
      </div>
      <div v-for="(room, index) in data" :key="index" class="col-12 col-md">
        <q-card class="my-card" @click="gotoMessage(room.id)" v-ripple>
          <q-card-section class="row justify-center">
            <q-icon name="folder" size="4em" color="grey" />
          </q-card-section>
          <q-card-actions class="text-bold text-subtitle2 my-text flex-center">
            #{{ room.title }}
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
  <template name="toolbar-left">
    <q-icon name="add" size="6em" color="grey" />
  </template>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "IndexPage",
  setup() {
    const $q = useQuasar();
    const $router = useRouter();
    const data = ref([]);
    const gotoMessage = (id) => {
      $router.push({ path: `/room/${id}/chats` });
    };
    const gotoCreateRoom = () => {
      $router.push({ path: "/room/create" });
    };
    const loadData = () => {
      api
        .get("/rooms")
        .then((response) => {
          data.value = response.data;
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

    onMounted(() => {
      loadData();
    });
    return { data, loadData, gotoMessage, gotoCreateRoom };
  },
});
</script>
<style lang="scss" scoped>
.my-card {
  width: 120px;
  margin: 1rem;
}
</style>
