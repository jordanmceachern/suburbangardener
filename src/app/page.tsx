import Link from "next/link";
import ErrorTester from "../components/ErrorTester";
import Greeting from "../components/Greeting";
import BannerSection from "../components/BannerSection";
import CommunitySection from "../components/CommunitySection";
import HomeArticlesSection from "../components/articles/HomeArticlesSection";
import FontStyleTest from "../components/FontStyleTest";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto space-y-8">
        <BannerSection />

        <div className="flex w-full items-start justify-between gap-4">
          <Greeting />

          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600"
          >
            Log In
          </Link>
        </div>

        <CommunitySection className="mt-8" />

        <HomeArticlesSection className="mt-12" />

        <FontStyleTest className="mt-12" />

        {process.env.NODE_ENV === "development" && (
          <div className="mt-8">
            <ErrorTester />
          </div>
        )}
      </div>
    </main>
  );
}
