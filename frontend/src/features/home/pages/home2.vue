
<template>
  <section class="home-hero">
    <!-- Audience selector (row 1) -->
    <div
      class="audience-wrap"
      role="list"
      aria-label="Audience selector"
    >
      <div
        v-for="a in audiences"
        :key="a.key"
        class="audience-card"
        :class="{ selected: selectedAudience === a.key }"
        role="listitem"
        :aria-pressed="selectedAudience === a.key"
        tabindex="0"
        @click="selectAudience(a.key)"
        @keydown.enter.prevent="selectAudience(a.key)"
        @keydown.space.prevent="selectAudience(a.key)"
        @focus="focused = a.key"
        @blur="focused = null"
      >
        <div class="audience-thumb" :aria-hidden="true">
          <v-img
            :src="a.img"
            :alt="a.alt"
            height="64"
            width="64"
            cover
            loading="lazy"
          />
          <div v-if="selectedAudience === a.key" class="selected-check" aria-hidden="true">
            <v-icon small>mdi-check-circle</v-icon>
          </div>
        </div>
        <div class="audience-label">{{ a.label }}</div>
      </div>
    </div>
    <!-- Hero Banner Slider (row 2) -->
    <div
      class="hero-wrap"
      @mouseenter="pauseAuto = true"
      @mouseleave="pauseAuto = false"
    >
      <div class="hero-slider" :style="{ transform: `translateX(-${activeIndex * 100}%)` }">
        <div
          v-for="(slide, i) in slides"
          :key="slide.id"
          class="hero-slide"
          :aria-hidden="i !== activeIndex"
          @click="onBannerClick(slide)"
          role="button"
          tabindex="0"
          @keydown.enter.prevent="onBannerClick(slide)"
        >
          <v-img :src="slide.image" class="hero-image" cover loading="lazy" :alt="slide.alt">
            <template #default>
              <div class="hero-overlay"></div>
            </template>
          </v-img>
          <div class="hero-content">
            <h1 class="hero-heading">{{ slide.headline }}</h1>
            <p class="hero-sub">{{ slide.sub }}</p>
            <v-btn class="hero-cta" elevation="2" @click.stop="onBannerCTA(slide)">{{ slide.cta }}</v-btn>
          </div>
        </div>
      </div>
      <!-- controls -->
      <button class="hero-arrow prev" @click="prev"><v-icon>mdi-chevron-left</v-icon></button>
      <button class="hero-arrow next" @click="next"><v-icon>mdi-chevron-right</v-icon></button>
      <!-- dots -->
      <div class="hero-dots" role="tablist" aria-label="Banner slides">
        <button
          v-for="(s, i) in slides"
          :key="s.id"
          class="dot"
          :class="{ active: i === activeIndex }"
          @click="goTo(i)"
          :aria-label="`Go to slide ${i + 1}`"
          :aria-selected="i === activeIndex"
          role="tab"
        />
      </div>
    </div>
    <!-- Features strip -->
    <div class="features-strip" role="list" aria-label="Key features">
      <div v-for="f in features" :key="f.key" class="feature" role="listitem" @click="onFeatureClick(f)">
        <v-icon large class="feature-icon">{{ f.icon }}</v-icon>
        <div class="feature-text">
          <div class="feature-title">{{ f.title }}</div>
          <div class="feature-sub">{{ f.sub }}</div>
        </div>
      </div>
    </div>
    <!-- Shop by brands -->
    <div class="shop-by section">
      <h3 class="section-title">Shop by brands</h3>
      <div class="brand-list" role="list" aria-label="Brands">
        <div
          v-for="b in brandsToShow"
          :key="b.id"
          class="brand-card"
          role="listitem"
          tabindex="0"
          @click="onBrandClick(b)"
          @keydown.enter.prevent="onBrandClick(b)"
        >
          <v-img :src="b.logo" :alt="`Brand ${b.name}`" class="brand-logo" contain loading="lazy" />
        </div>
        <div v-if="brands.length > maxBrandsShown" class="brand-card view-all" @click="viewAllBrands" tabindex="0" @keydown.enter.prevent="viewAllBrands">
          <div class="view-all-inner">View all brands</div>
        </div>
      </div>
    </div>
    <!-- Shop by categories -->
    <div class="shop-by section">
      <h3 class="section-title">Shop by categories</h3>
      <div class="category-list" role="list" aria-label="Categories">
        <button
          v-for="c in categories"
          :key="c.id"
          class="category-chip"
          @click="onCategoryClick(c)"
          @keydown.enter.prevent="onCategoryClick(c)"
          tabindex="0"
        >
          {{ c.name }}
        </button>
      </div>
    </div>
    <!-- Community / testimonials -->
    <div class="community section">
      <div class="community-left">
        <h3>Discover our community</h3>
        <p class="community-lead">Join thousands of sellers & buyers sharing stories — thrift, sustainability, and smart shopping.</p>
        <v-btn class="bg-primary text-white" @click="onCommunityCTA">Join the community</v-btn>
      </div>
      <div class="community-right">
        <div class="testimonials">
          <div v-for="(t, i) in testimonials" :key="t.id" class="testimonial" :class="{ active: i === testimonialIndex }" aria-hidden="i !== testimonialIndex">
            <div class="testimonial-body">“{{ t.quote }}”</div>
            <div class="testimonial-meta">
              <v-avatar size="40"><v-img :src="t.avatar" :alt="`Avatar of ${t.name}`" loading="lazy" /></v-avatar>
              <div class="meta-text">
                <div class="meta-name">{{ t.name }}</div>
                <div class="meta-rating">★ {{ t.rating }}/5</div>
              </div>
            </div>
          </div>
          <div class="testimonial-controls">
            <button @click="prevTestimonial" aria-label="Previous testimonial"><v-icon>mdi-chevron-left</v-icon></button>
            <button @click="nextTestimonial" aria-label="Next testimonial"><v-icon>mdi-chevron-right</v-icon></button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
/* --- Data (replace or fetch from API as you like) --- */
const router = useRouter();
const audiences = [
  { key: "male", label: "Men", img: "https://picsum.photos/id/100/160/160", alt: "Male clothing" },
  { key: "female", label: "Women", img: "https://picsum.photos/id/101/160/160", alt: "Female clothing" },
  { key: "kids", label: "Kids", img: "https://picsum.photos/id/102/160/160", alt: "Kids clothing" },
  { key: "unisex", label: "Unisex", img: "https://picsum.photos/id/103/160/160", alt: "Unisex clothing" },
];
const slides = [
  { id: 1, image: "https://picsum.photos/1400/700?random=21", headline: "Sell your clothes — fast & easy", sub: "List in minutes. Reach buyers nearby.", cta: "Start Selling", link: "/create-list" , alt: "Start selling banner" },
  { id: 2, image: "https://picsum.photos/1400/700?random=22", headline: "Open a shop — sell stock from your store", sub: "Launch your storefront on FreeUp", cta: "Create Shop", link: "/create-shop", alt: "Create shop banner" },
  { id: 3, image: "https://picsum.photos/1400/700?random=23", headline: "Discover thrifted treasures", sub: "Curated second-hand fashion & home goods", cta: "Explore", link: "/products", alt: "Discover treasures banner" },
];
const features = [
  { key: "low", icon: "mdi-currency-inr", title: "Lowest prices", sub: "Price match guarantee" },
  { key: "cod", icon: "mdi-truck-delivery", title: "Easy COD", sub: "Cash on delivery available" },
  { key: "return", icon: "mdi-clipboard-check", title: "Hassle-free returns", sub: "7-day easy returns" },
  { key: "secure", icon: "mdi-lock", title: "Secure payments", sub: "Encrypted & trusted" },
  { key: "fast", icon: "mdi-timer-sand", title: "Fast delivery", sub: "Quick dispatch" },
];
const brands = [
  { id: 1, name: "Zara", logo: "https://picsum.photos/seed/zara/120/60" },
  { id: 2, name: "H&M", logo: "https://picsum.photos/seed/hm/120/60" },
  { id: 3, name: "Nike", logo: "https://picsum.photos/seed/nike/120/60" },
  { id: 4, name: "Levis", logo: "https://picsum.photos/seed/levis/120/60" },
  { id: 5, name: "Adidas", logo: "https://picsum.photos/seed/adidas/120/60" },
  { id: 6, name: "Uniqlo", logo: "https://picsum.photos/seed/uniqlo/120/60" },
];
const categories = [
  { id: 1, name: "Tops" },
  { id: 2, name: "Bottoms" },
  { id: 3, name: "Shoes" },
  { id: 4, name: "Accessories" },
  { id: 5, name: "Bags" },
];
const testimonials = [
  { id: 1, name: "Asha", quote: "Found a great jacket at half price. Loved it!", avatar: "https://i.pravatar.cc/40?img=1", rating: 5 },
  { id: 2, name: "Rohit", quote: "Selling was smooth and fast. Good payouts.", avatar: "https://i.pravatar.cc/40?img=2", rating: 5 },
  { id: 3, name: "Neha", quote: "Easy returns and friendly support. Recommended!", avatar: "https://i.pravatar.cc/40?img=3", rating: 4.5 },
];
/* --- Reactive state --- */
const selectedAudience = ref(null);
const focused = ref(null);
const activeIndex = ref(0);
const pauseAuto = ref(false);
const intervalMs = 6000;
let autoTimer = null;
/* Testimonials */
const testimonialIndex = ref(0);
let tTimer = null;
/* brands display limit */
const maxBrandsShown = 6;
const brandsToShow = computed(() => brands.slice(0, maxBrandsShown));
/* --- Lifecycle & auto-rotation --- */
function startAuto() {
  stopAuto();
  autoTimer = setInterval(() => {
    if (!pauseAuto.value) {
      activeIndex.value = (activeIndex.value + 1) % slides.length;
    }
  }, intervalMs);
}
function stopAuto() {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
}

onMounted(() => {
  startAuto();
  tTimer = setInterval(() => {
    testimonialIndex.value = (testimonialIndex.value + 1) % testimonials.length;
  }, 7000);
});
onUnmounted(() => {
  stopAuto();
  if (tTimer) clearInterval(tTimer);
});
/* --- Actions --- */
function selectAudience(audience) {
  selectedAudience.value = selectedAudience.value === audience ? null : audience;
  // emit filter event for parent and navigate
  // (parent can listen to `filter` ; we also navigate to products with query param)
  // analytics placeholder:
  console.log("analytics: audience_click", { audience: selectedAudience.value });
  // emit event
  // (if used as a child component, parent can listen: @filter="..." )
  // we use $emit via defineEmits
  tryEmitFilter(selectedAudience.value);
  router.push({ name: "product-list", query: selectedAudience.value ? { audience: selectedAudience.value } : {} });
}
const emit = defineEmits(["filter"]);
function tryEmitFilter(a) {
  emit("filter", { audience: a });
}
/* Banner controls */
function prev() {
  activeIndex.value = (activeIndex.value - 1 + slides.length) % slides.length;
}
function next() {
  activeIndex.value = (activeIndex.value + 1) % slides.length;
}
function goTo(i) {
  activeIndex.value = i;
}
function onBannerClick(slide) {
  // follow entire slide link
  console.log("analytics: banner_click", { id: slide.id, link: slide.link });
  if (slide.link) router.push(slide.link);
}
function onBannerCTA(slide) {
  console.log("analytics: banner_cta", { id: slide.id, cta: slide.cta });
  if (slide.link) router.push(slide.link);
}
/* features, brands, categories */
function onFeatureClick(f) {
  console.log("analytics: feature_click", f);
  // navigate to marketing page or show details
  router.push({ path: "/help", query: { feature: f.key } });
}
function onBrandClick(b) {
  console.log("analytics: brand_click", b);
  router.push({ name: "product-list", query: { brand_id: b.id } });
}
function viewAllBrands() {
  router.push({ name: "brand-list" });
}
function onCategoryClick(c) {
  console.log("analytics: category_click", c);
  router.push({ name: "product-list", query: { category_id: c.id } });
}
/* testimonials */
function prevTestimonial() {
  testimonialIndex.value = (testimonialIndex.value - 1 + testimonials.length) % testimonials.length;
}
function nextTestimonial() {
  testimonialIndex.value = (testimonialIndex.value + 1) % testimonials.length;
}
function onCommunityCTA() {
  console.log("analytics: community_cta");
  router.push({ name: "community" });
}
/* accessibility: keep keyboard focus within audience via arrows (optional) */
function handleAudienceKey(e) {
  // not wired here; kept for future enhancements
}
</script>
<style scoped>
.home-hero {
  display: grid;
  gap: 24px;
  padding: 16px 0;
}
/* Audience selector */
.audience-wrap {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  min-height: 10vh;
  max-height: 15vh;
  padding: 8px;
  flex-wrap: nowrap;
  overflow-x: auto;
}
.audience-card {
  width: 92px;
  min-width: 92px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  background: var(--v-theme-surface);
  cursor: pointer;
  outline: none;
  transition: transform .12s ease, box-shadow .12s ease, border-color .12s;
}
.audience-card:focus {
  box-shadow: 0 6px 18px rgba(0,0,0,.12);
}
.audience-card.selected {
  border: 2px solid rgba(33,150,243,0.9);
  box-shadow: 0 6px 20px rgba(33,150,243,0.12);
  transform: translateY(-4px);
}
.audience-thumb {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
}
.selected-check {
  position: absolute;
  right: 4px;
  bottom: 4px;
  color: white;
  background: rgba(33,150,243,0.9);
  border-radius: 50%;
  padding: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
/* Hero slider */
.hero-wrap {
  position: relative;
  width: 100%;
  height: 60vh; /* desktop hero height */
  max-height: 70vh;
  min-height: 40vh;
  overflow: hidden;
  border-radius: 12px;
}
@media (max-width: 768px) {
  .hero-wrap { height: 52vh; }
}
.hero-slider {
  display: flex;
  height: 100%;
  transition: transform .6s cubic-bezier(.2,.9,.2,1);
}
.hero-slide {
  min-width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  display:flex;
  align-items: center;
  justify-content: center;
}
.hero-image {
  position: absolute;
  inset: 0;
  z-index: 1;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0,0,0,0.35), rgba(0,0,0,0.15));
  z-index: 2;
}
/* Hero content */
.hero-content {
  z-index: 3;
  position: relative;
  max-width: 900px;
  padding: 24px;
  color: white;
  text-align: left;
}
.hero-heading {
  font-size: clamp(20px, 4vw, 36px);
  margin: 0 0 8px;
  line-height: 1.05;
  font-weight: 700;
}
.hero-sub {
  margin: 0 0 16px;
  opacity: 0.95;
  font-size: clamp(14px, 1.6vw, 18px);
}
/* controls */
.hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: rgba(255,255,255,0.9);
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.hero-arrow.prev { left: 12px; }
.hero-arrow.next { right: 12px; }
.hero-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display:flex;
  gap: 8px;
  z-index: 10;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius:50%;
  background: rgba(255,255,255,0.5);
  border: none;
  cursor: pointer;
}
.dot.active { background: white; }
/* features strip */
.features-strip {
  display:flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
.feature {
  display:flex;
  gap: 12px;
  align-items:center;
  min-width: 200px;
  padding: 10px 14px;
  border-radius: 10px;
  background: var(--v-theme-surface);
  cursor: pointer;
  transition: box-shadow .12s ease;
}
.feature:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
.feature-icon { font-size: 28px; }
.feature-title { font-weight: 600; }
.feature-sub { font-size: 12px; color: rgba(0,0,0,0.6); }
/* shop-by */
.section { padding-top: 12px; padding-bottom: 12px; }
.section-title { margin: 8px 0; font-weight: 700; font-size: 18px; }
.brand-list {
  display:flex;
  gap: 12px;
  flex-wrap: nowrap;
  overflow-x: auto;
  align-items: center;
  padding-bottom: 6px;
}
.brand-card {
  width: 120px;
  height: 64px;
  border-radius: 8px;
  background: var(--v-theme-surface);
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  padding: 8px;
  transition: transform .12s ease, box-shadow .12s ease;
}
.brand-card:hover { transform: translateY(-4px); box-shadow: 0 8px 18px rgba(0,0,0,0.08); }
.brand-logo img { object-fit: contain; }
.view-all { display:flex; align-items:center; justify-content:center; }
.view-all-inner { font-weight: 600; color: var(--v-theme-on-surface); }
/* categories */
.category-list {
  display:flex;
  gap: 8px;
  flex-wrap: wrap;
}
.category-chip {
  background: var(--v-theme-surface);
  border-radius: 20px;
  padding: 8px 12px;
  cursor: pointer;
  border: 1px solid rgba(0,0,0,0.06);
}
.category-chip:focus { box-shadow: 0 8px 18px rgba(0,0,0,0.08); outline: none; }
/* community */
.community {
  display:flex;
  gap: 18px;
  align-items: stretch;
  padding: 24px 0;
  background: transparent;
  border-radius: 8px;
}
.community-left { flex: 1 1 320px; }
.community-right { flex: 1 1 420px; }
.testimonials { position: relative; }
.testimonial {
  display:none;
  background: var(--v-theme-surface);
  padding: 18px;
  border-radius: 8px;
  min-height: 120px;
}
.testimonial.active { display:block; }
.testimonial-body { font-style: italic; margin-bottom: 12px; }
.testimonial-meta { display:flex; align-items:center; gap: 8px; }
.meta-name { font-weight: 600; }
.meta-rating { font-size: 12px; color: rgba(0,0,0,0.6); }
.testimonial-controls { margin-top: 12px; display:flex; gap: 8px; }
/* responsiveness */
@media (max-width: 1024px) {
  .community { flex-direction: column; }
  .brand-list { gap: 8px; }
  .audience-wrap { justify-content: flex-start; padding-left: 12px; }
  .hero-content { padding: 16px; }
}
@media (max-width: 640px) {
  .audience-card { width: 84px; min-width: 84px; }
  .hero-wrap { height: 52vh; }
  .hero-heading { font-size: 20px; }
  .community-right { order: 2; }
  .community-left { order: 1; }
}
</style>










