<template>
  <v-card>
    <v-card-title class="text-h6">Register</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="handleSubmit('register')" ref="formRef">
        <v-text-field
          v-model="formData.name"
          label="Name"
          :rules="[val => !!val || 'Name is required']"
          required
        />
        <v-text-field
          v-model="formData.email"
          label="Email"
          type="email"
          :rules="[val => !!val || 'Email is required']"
          required
        />
        <v-text-field
          v-model="formData.password"
          label="Password"
          type="password"
          :rules="[val => (val && val.length >= 6) || 'Min 6 chars']"
          required
        />

        <v-alert type="error" v-if="error" class="mt-2">{{ error }}</v-alert>

        <v-card-actions class="mt-4">
          <v-spacer />
          <v-btn :loading="loading" color="primary" type="submit">Register</v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import AuthMixin from "@/features/auth/mixins/AuthMixin";

export default {
  mixins: [AuthMixin],
};
</script>

<style scoped></style>
