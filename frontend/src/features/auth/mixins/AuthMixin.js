export default {
  data() {
    return {
      formData: { name: "", email: "", password: "" },
      loading: false,
      error: null,
    };
  },
  methods: {
    async handleSubmit(action) {
      this.loading = true;
      this.error = null;
      try {
        await this.$store.dispatch(`auth/${action}`, this.formData);
        // on success navigate to root (or a protected page)
        this.$router.replace("/");
      } catch (err) {
        // prefer server message when available
        this.error = err.response?.data?.message || err.message || "Something went wrong";
      } finally {
        this.loading = false;
      }
    },
  },
};
