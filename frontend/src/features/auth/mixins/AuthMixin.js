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
        this.$router.replace("/");
      } catch (err) {
        this.error = err.response?.data?.message || err.message || "Something went wrong";
      } finally {
        this.loading = false;
      }
    },
  },
};
