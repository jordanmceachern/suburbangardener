import ErrorTester from "../components/ErrorTester";
import Greeting from "../components/Greeting";
import BannerSection from "../components/BannerSection";
import CustomBuildSection from "../components/CustomBuildSection";
import HomePostsSection from "../components/posts/HomePostsSection";
import FontStyleTest from "../components/FontStyleTest";
import Link from "next/link";
import { bioStyles } from "../lib/tailwind";

// Renders the Home home-area UI.
export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto space-y-8">
        <BannerSection />

        <Greeting />

        <CustomBuildSection className="mt-8" />

        <HomePostsSection className="mt-12" />

        <FontStyleTest className="mt-12" />

        {process.env.NODE_ENV === "development" && (
          <div className="mt-8">
            <ErrorTester />
          </div>
        )}

        <div className={bioStyles.homeBlock}>
          <p className={bioStyles.homeDescription}>
            Want to learn more about the gardener behind Suburban Gardener?
          </p>
          <Link href="/bio" className={bioStyles.homeLink}>
            Read Jordan&apos;s bio
          </Link>
        </div>
      </div>
    </main>
  );
}
