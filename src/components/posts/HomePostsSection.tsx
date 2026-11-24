"use client";

import { useState, useEffect } from "react";
import PostDisplayCard from "./PostDisplayCard";
import ViewAllPostsButton from "./ViewAllPostsButton";
import { homePostStyles } from "../../lib/tailwind";
import type { PostDisplayData } from "./PostDisplayCard";

async function fetchFeaturedPosts(): Promise<PostDisplayData[]> {
  try {
    const response = await fetch("/api/posts?limit=2&offset=0", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Posts");
    }

    const data = await response.json();
    if (!Array.isArray(data.posts)) {
      return [];
    }

    return data.posts.slice(0, 2);
  } catch (error) {
    console.error("Error fetching Posts:", error);
    return [];
  }
}

// Renders the HomePostsSection UI block.
export default function HomePostsSection() {
  const [posts, setPosts] = useState<PostDisplayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await fetchFeaturedPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error loading Posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <section className={homePostStyles.sectionLoading}>
        <div className={homePostStyles.titleWrap}>
          <h2 className={homePostStyles.title}>Community Shared Knowledge</h2>
          <p className={homePostStyles.description}>
            Discover tips to improve your harvest, or share something
            you&apos;ve learned on your gardening journey to help others! We are
            a community, let&apos;s grow together along with our veggies to
            create a happier, healthier planet.
          </p>
        </div>
        <div className={homePostStyles.grid}>
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className={homePostStyles.skeletonCard}>
              <div className={homePostStyles.skeletonBlock} />
              <div className={homePostStyles.skeletonLine} />
              <div className={homePostStyles.skeletonMeta} />
              <div className={homePostStyles.skeletonMetaShort} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={homePostStyles.sectionLoaded}>
      <div className={homePostStyles.titleWrap}>
        <h2 className={homePostStyles.title}>Community Shared Knowledge</h2>
        <p className={homePostStyles.descriptionMobile}>
          Discover tips to improve your harvest, or share something you&apos;ve
          learned on your gardening journey to help others! We are a community,
          let&apos;s grow together along with our veggies to create a happier,
          healthier planet.
        </p>
      </div>

      <div className={homePostStyles.grid}>
        {posts.map(post => (
          <PostDisplayCard key={post.id} post={post} />
        ))}
      </div>

      <div className={homePostStyles.ctaWrap}>
        <ViewAllPostsButton className={homePostStyles.ctaButton} />
      </div>
    </section>
  );
}
