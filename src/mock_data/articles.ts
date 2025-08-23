import type { ArticleDisplayData } from "../components/articles/ArticleDisplayCard";

// Article based on the markdown file in this directory
export const organicTomatoesArticle: ArticleDisplayData = {
  id: "organic-tomatoes-guide",
  title: "The Complete Guide to Growing Organic Tomatoes",
  excerpt:
    "Growing organic tomatoes is one of the most rewarding experiences for any gardener, but it's definitely not a beginner's crop. These beautiful, flavorful fruits require patience, attention, and the right approach to truly thrive in your garden.",
  publishedDate: "August 15, 2024",
  author: "Sarah Mitchell",
  slug: "growing-organic-tomatoes",
  imageUrl:
    "https://res.cloudinary.com/dtweazqf2/image/upload/q_auto,f_auto/v1755004794/SuburbanGardener/toflato_l0dkqy.jpg",
  category: "Vegetables",
};

// Additional articles for variety
export const mockArticles: ArticleDisplayData[] = [
  organicTomatoesArticle,
  {
    id: "spring-garden-planning",
    title: "Spring Garden Planning: Your Complete Guide",
    excerpt:
      "As winter fades away, it's time to start planning your spring garden. This comprehensive guide covers everything from soil preparation to plant selection for a thriving suburban garden.",
    publishedDate: "March 15, 2025",
    author: "Jordan McEachern",
    slug: "spring-garden-planning-complete-guide",
    imageUrl:
      "https://res.cloudinary.com/dtweazqf2/image/upload/q_auto,f_auto/v1754661543/SuburbanGardener/IMG_7668_iiqz5m.jpg",
    category: "Planning",
  },
  {
    id: "organic-soil-building",
    title: "Organic Soil Building: The Foundation of Success",
    excerpt:
      "Discover the secrets to creating rich, fertile soil that will support healthy plant growth and abundant harvests throughout the growing season.",
    publishedDate: "March 12, 2025",
    author: "Sarah Mitchell",
    slug: "organic-soil-building-foundation",
    imageUrl:
      "https://res.cloudinary.com/dtweazqf2/image/upload/q_auto,f_auto/v1754661543/SuburbanGardener/IMG_7775_tov5ej.jpg",
    category: "Soil Care",
  },
  {
    id: "water-wise-gardening",
    title: "Water-Wise Gardening: Sustainable Irrigation",
    excerpt:
      "Learn efficient watering techniques and drought-resistant plant selections that will keep your garden thriving while conserving this precious resource.",
    publishedDate: "March 8, 2025",
    author: "Jordan McEachern",
    slug: "water-wise-gardening-sustainable-irrigation",
    imageUrl:
      "https://res.cloudinary.com/dtweazqf2/image/upload/q_auto,f_auto/v1754661543/SuburbanGardener/IMG_7722_sveqok.jpg",
    category: "Watering",
  },
  {
    id: "container-gardening",
    title: "Container Gardening for Beginners",
    excerpt:
      "Start your gardening journey with containers! Learn the basics of choosing pots, soil, and plants for successful container gardening in any space.",
    publishedDate: "March 5, 2025",
    author: "Sarah Mitchell",
    slug: "container-gardening-beginners",
    imageUrl:
      "https://res.cloudinary.com/dtweazqf2/image/upload/q_auto,f_auto/v1754661544/SuburbanGardener/IMG_7791_nl7dzw.jpg",
    category: "Container Gardening",
  },
  {
    id: "composting-basics",
    title: "Composting 101: Turn Waste into Garden Gold",
    excerpt:
      "Master the art of composting with this beginner-friendly guide. Transform kitchen scraps and yard waste into nutrient-rich soil amendments for your garden.",
    publishedDate: "February 28, 2025",
    author: "Jordan McEachern",
    slug: "composting-101-waste-to-garden-gold",
    imageUrl:
      "https://res.cloudinary.com/dtweazqf2/image/upload/q_auto,f_auto/v1754661542/SuburbanGardener/IMG_7560_bfcsta.jpg",
    category: "Composting",
  },
  {
    id: "pest-control-natural",
    title: "Natural Pest Control: Protecting Your Garden Organically",
    excerpt:
      "Keep pests at bay without harmful chemicals. Learn about beneficial insects, companion planting, and organic deterrents that protect your plants naturally.",
    publishedDate: "February 25, 2025",
    author: "Sarah Mitchell",
    slug: "natural-pest-control-organic-methods",
    imageUrl:
      "https://res.cloudinary.com/dtweazqf2/image/upload/q_auto,f_auto/v1754661542/SuburbanGardener/IMG_1402_jv7cf5.jpg",
    category: "Pest Control",
  },
];

// Export the most recent article as featured and sidebar articles for compatibility
const getMostRecentArticle = () => {
  return mockArticles.reduce((latest, current) => {
    const latestDate = new Date(latest.publishedDate);
    const currentDate = new Date(current.publishedDate);
    return currentDate > latestDate ? current : latest;
  });
};

export const mockFeaturedArticle = getMostRecentArticle();
export const mockSidebarArticles = mockArticles.slice(1, 4); // Skip the featured one
