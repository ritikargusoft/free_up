<template>
  <v-container
    fluid
    class="pa-6 mt-16"
    style="background: #f6f8f7; min-height: 100vh"
  >
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-row>
          <!-- Sidebar -->
          <v-col cols="12" md="4">
            <v-sheet rounded="xl" class="pa-6">
              <slot name="sidebar" />
            </v-sheet>
          </v-col>

          <!-- Main content -->
          <v-col cols="12" md="8">
            <v-sheet rounded="xl" class="pa-6">
              <slot />
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
