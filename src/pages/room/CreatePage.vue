<template>
  <q-page class="flex flex-center">
    <!-- <div class="q-pa-md" style="max-width: 640px"> -->
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="title"
        label="Room title *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
    <!-- </div> -->
  </q-page>
</template>
<script>
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { api } from "boot/axios";

export default {
  setup() {
    const $q = useQuasar();
    const $router = useRouter();
    const title = ref(null);

    return {
      title,

      onSubmit() {
        api
          .post("/rooms", {
            title: title.value,
          })
          .then((response) => {
            $router.push({ path: "/" });
          })
          .catch(() => {
            $q.notify({
              color: "negative",
              position: "top",
              message: "Save failed",
              icon: "report_problem",
            });
          });
      },

      onReset() {
        title.value = null;
      },
    };
  },
};
</script>
