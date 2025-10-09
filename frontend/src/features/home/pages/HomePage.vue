<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h2>Discover Pre-loved Finds</h2>
        <p>Welcome to FreeUp — a simple marketplace for pre-owned fashion & home goods.</p>
      </v-col>
      <v-col cols="12" sm="6" md="4" v-for="n in 6" :key="n">
        <v-card>
          <v-img src="https://picsum.photos/600/400?random={{n}}" height="200px" />
          <v-card-title>Product {{ n }}</v-card-title>
          <v-card-text>Short description & condition — stylish used item.</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text>View</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script setup></script>