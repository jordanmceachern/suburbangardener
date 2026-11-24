import Greeting from "../components/Greeting";
import BannerSection from "../components/BannerSection";
import CustomBuildSection from "../components/CustomBuildSection";
import HomePostsSection from "../components/posts/HomePostsSection";
import Link from "next/link";
import { bioStyles, homePageStyles } from "../lib/tailwind";

// Renders the Home home-area UI.
export default function Home() {
  return (
    <main className={homePageStyles.main}>
      <div className={homePageStyles.container}>
        <BannerSection />

        <Greeting />

        <CustomBuildSection />

        <HomePostsSection />

        <div className={bioStyles.homeBlock}>
          <p className={bioStyles.homeDescription}>
            Want to know what inspired Suburban Gardener?
          </p>
          <Link
            aria-label="About me"
            className={bioStyles.homeLink}
            href="/bio"
          >
            About me
          </Link>
        </div>
      </div>
    </main>
  );
}
