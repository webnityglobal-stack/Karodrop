// Fallback demo data — used only if the backend API isn't reachable yet.
//
// Once your backend + MongoDB are running and seeded (npm run seed),
// the site automatically switches to live data.

const sampleProducts = [
  {
    _id: "s1",
    title: "Block-Print Cotton Tee — Indigo",
    slug: "block-print-tee-indigo",
    category: "tshirts",

    price: 499,
    compareAtPrice: 899,

    images: ["/images/products/black-t-shirt.png"],

    rating: 4.8,
    reviewCount: 126,

    description:
      "Premium cotton t-shirt designed for custom printing and everyday comfort. A perfect choice for creators, brands and online sellers.",

    printingOptions: [
      "DTF Printing",
      "DTG Printing",
      "Screen Printing",
    ],

    colors: [
      "Black",
      "White",
      "Navy Blue",
      "Royal Blue",
      "Grey",
    ],

    sizes: ["S", "M", "L", "XL", "XXL"],

    highlights: [
      "100% Premium Cotton",
      "180 GSM Fabric",
      "Regular Fit",
      "Pre-shrunk Fabric",
      "Suitable for Custom Printing",
      "No Minimum Order",
    ],

    available: true,
    stock: 500,

    productionTime: "2–4 business days",
    deliveryTime: "3–7 business days",

    isFeatured: true,
  },

  {
    _id: "s2",
    title: "Warli Art Graphic Tee",
    slug: "warli-art-tee",
    category: "tshirts",

    price: 549,
    compareAtPrice: 999,

    images: ["/images/products/graphic-t-shirt.png"],

    rating: 4.7,
    reviewCount: 94,

    description:
      "Comfortable graphic t-shirt made for creative designs, custom artwork and modern streetwear brands.",

    printingOptions: [
      "DTF Printing",
      "DTG Printing",
      "Screen Printing",
      
    ],

    colors: [
      "Black",
      "White",
      "Beige",
      "Navy Blue",
    ],

    sizes: ["S", "M", "L", "XL", "XXL"],

    highlights: [
      "Premium Cotton Fabric",
      "180 GSM",
      "Soft & Breathable",
      "Regular Fit",
      "Custom Design Friendly",
      "Creator & Brand Ready",
    ],

    available: true,
    stock: 450,

    productionTime: "2–4 business days",
    deliveryTime: "3–7 business days",
  },

  {
    _id: "s3",
    title: "Mandala Oversized Tee",
    slug: "mandala-oversized-tee",
    category: "tshirts",

    price: 599,

    images: ["/images/products/Oversized-tee.png"],

    rating: 4.9,
    reviewCount: 178,

    description:
      "Premium oversized t-shirt with a relaxed fit, ideal for streetwear brands, creators and custom apparel businesses.",

    printingOptions: [
      "DTF Printing",
      "DTG Printing",
      "Screen Printing",
      "Puff Printing",
    ],

    colors: [
      "Black",
      "White",
      "Charcoal",
      "Olive Green",
      "Navy Blue",
    ],

    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],

    highlights: [
      "Oversized Fit",
      "220 GSM Premium Fabric",
      "100% Cotton",
      "Drop Shoulder",
      "Soft & Comfortable",
      "Perfect for Streetwear Brands",
    ],

    available: true,
    stock: 350,

    productionTime: "2–4 business days",
    deliveryTime: "3–7 business days",
  },

  {
    _id: "s4",
    title: "Hand-Carved Wooden Elephant",
    slug: "wooden-elephant",
    category: "handicrafts",

    price: 899,
    compareAtPrice: 1499,

    images: ["/images/products/Wooden-elephant.png"],

    rating: 4.8,
    reviewCount: 67,

    description:
      "Beautiful handcrafted wooden elephant decor made by skilled artisans. Ideal for home decor and lifestyle stores.",

    printingOptions: [
      "Not Applicable",
    ],

    colors: [
      "Natural Wood",
      "Dark Brown",
    ],

    sizes: [
      "Small",
      "Medium",
      "Large",
    ],

    highlights: [
      "Handcrafted Product",
      "Natural Wood Finish",
      "Artisan Made",
      "Decorative Home Accent",
      "Each Piece is Unique",
    ],

    available: true,
    stock: 80,

    productionTime: "3–5 business days",
    deliveryTime: "4–8 business days",

    isFeatured: true,
  },

  {
    _id: "s5",
    title: "Terracotta Wall Hanging",
    slug: "terracotta-wall-hanging",
    category: "handicrafts",

    price: 649,

    images: ["/images/products/terracotta-wall-hanging.png"],

    rating: 4.6,
    reviewCount: 52,

    description:
      "Traditional terracotta wall decor that brings an artistic handcrafted touch to modern interiors.",

    printingOptions: [
      "Not Applicable",
    ],

    colors: [
      "Terracotta",
      "Natural",
    ],

    sizes: [
      "Small",
      "Medium",
      "Large",
    ],

    highlights: [
      "Handcrafted Terracotta",
      "Traditional Indian Artwork",
      "Lightweight",
      "Home & Office Decor",
      "Unique Artisan Finish",
    ],

    available: true,
    stock: 120,

    productionTime: "3–5 business days",
    deliveryTime: "4–8 business days",
  },

  {
    _id: "s6",
    title: "Bamboo Woven Storage Basket",
    slug: "bamboo-basket",
    category: "handicrafts",

    price: 449,

    images: ["/images/products/bamboo-basket.png"],

    rating: 4.7,
    reviewCount: 43,

    description:
      "Eco-friendly bamboo storage basket with a natural woven finish for everyday organization and home decor.",

    printingOptions: [
      "Not Applicable",
    ],

    colors: [
      "Natural Bamboo",
      "Brown",
    ],

    sizes: [
      "Small",
      "Medium",
      "Large",
    ],

    highlights: [
      "Eco-friendly Bamboo",
      "Handwoven",
      "Lightweight",
      "Multi-purpose Storage",
      "Natural Finish",
    ],

    available: true,
    stock: 150,

    productionTime: "2–4 business days",
    deliveryTime: "4–8 business days",
  },

  {
    _id: "s7",
    title: "Oxidised Silver Jhumka Earrings",
    slug: "oxidised-jhumka",
    category: "jewellery",

    price: 349,
    compareAtPrice: 599,

    images: ["/images/products/oxidised-jhumka.png"],

    rating: 4.8,
    reviewCount: 112,

    description:
      "Elegant oxidised silver jhumka earrings designed for ethnic, casual and festive looks.",

    printingOptions: [
      "Not Applicable",
    ],

    colors: [
      "Oxidised Silver",
    ],

    sizes: [
      "One Size",
    ],

    highlights: [
      "Oxidised Finish",
      "Lightweight",
      "Traditional Design",
      "Festive & Casual Wear",
      "Comfortable for Long Wear",
    ],

    available: true,
    stock: 250,

    productionTime: "1–3 business days",
    deliveryTime: "3–7 business days",

    isFeatured: true,
  },

  {
    _id: "s8",
    title: "Kundan Choker Necklace Set",
    slug: "kundan-choker-set",
    category: "jewellery",

    price: 1299,
    compareAtPrice: 2199,

    images: ["/images/products/kundan-choker-set.png"],

    rating: 4.9,
    reviewCount: 86,

    description:
      "Premium kundan choker necklace set designed for weddings, festivals and premium fashion collections.",

    printingOptions: [
      "Not Applicable",
    ],

    colors: [
      "Gold",
      "Red",
      "Green",
    ],

    sizes: [
      "One Size",
    ],

    highlights: [
      "Kundan Style Work",
      "Premium Look",
      "Statement Jewellery",
      "Wedding & Festive Wear",
      "Matching Necklace Set",
    ],

    available: true,
    stock: 70,

    productionTime: "2–4 business days",
    deliveryTime: "3–7 business days",
  },

  {
    _id: "s9",
    title: "Beaded Anklet Pair",
    slug: "beaded-anklet-pair",
    category: "jewellery",

    price: 299,

    images: ["/images/products/beaded-anklet-pair.png"],

    rating: 4.6,
    reviewCount: 38,

    description:
      "Stylish beaded anklet pair with a lightweight design suitable for everyday and festive styling.",

    printingOptions: [
      "Not Applicable",
    ],

    colors: [
      "Multicolor",
      "Black",
      "White",
    ],

    sizes: [
      "Adjustable",
    ],

    highlights: [
      "Adjustable Design",
      "Lightweight",
      "Handcrafted Look",
      "Comfortable Fit",
      "Everyday & Festive Wear",
    ],

    available: true,
    stock: 180,

    productionTime: "1–3 business days",
    deliveryTime: "3–7 business days",
  },

  {
    _id: "s10",
    title: "Brass Ganesha Idol — 5 inch",
    slug: "brass-ganesha-idol",
    category: "idols",

    price: 999,
    compareAtPrice: 1699,

    images: ["/images/products/brass-ganesha-idol.png"],

    rating: 4.9,
    reviewCount: 143,

    description:
      "Elegant brass Ganesha idol suitable for home temples, office spaces, gifting and spiritual decor.",

    printingOptions: [
      "Not Applicable",
    ],

    colors: [
      "Antique Gold",
      "Brass",
    ],

    sizes: [
      "5 inch",
    ],

    highlights: [
      "Premium Brass Finish",
      "Traditional Design",
      "5 Inch Size",
      "Home & Office Decor",
      "Ideal for Gifting",
    ],

    available: true,
    stock: 100,

    productionTime: "2–4 business days",
    deliveryTime: "3–7 business days",

    isFeatured: true,
  },

  {
    _id: "s11",
    title: "Marble-Finish Krishna Statue",
    slug: "marble-krishna-statue",
    category: "idols",

    price: 1199,

    images: ["/images/products/marble-krishna-statue.png"],

    rating: 4.8,
    reviewCount: 91,

    description:
      "Beautiful marble-finish Krishna statue designed for elegant home, temple and office decor.",

    printingOptions: [
      "Not Applicable",
    ],

    colors: [
      "White",
      "Marble Finish",
    ],

    sizes: [
      "Small",
      "Medium",
      "Large",
    ],

    highlights: [
      "Marble Finish",
      "Detailed Craftsmanship",
      "Elegant Appearance",
      "Home Temple Suitable",
      "Premium Decorative Piece",
    ],

    available: true,
    stock: 65,

    productionTime: "3–5 business days",
    deliveryTime: "4–8 business days",
  },

  {
    _id: "s12",
    title: "Buddha Meditation Idol — White",
    slug: "buddha-meditation-idol",
    category: "idols",

    price: 749,

    images: ["/images/products/buddha-meditation-idol.png"],

    rating: 4.7,
    reviewCount: 74,

    description:
      "Minimal white Buddha meditation idol for peaceful, modern and elegant home or office interiors.",

    printingOptions: [
      "Not Applicable",
    ],

    colors: [
      "White",
      "Ivory",
    ],

    sizes: [
      "Small",
      "Medium",
    ],

    highlights: [
      "Minimal Design",
      "White Finish",
      "Meditation & Decor",
      "Home & Office Suitable",
      "Premium Decorative Look",
    ],

    available: true,
    stock: 90,

    productionTime: "2–4 business days",
    deliveryTime: "3–7 business days",
  },
];

export default sampleProducts;