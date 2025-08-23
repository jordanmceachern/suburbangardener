import ErrorTester from "../components/ErrorTester";
import Greeting from "../components/Greeting";
import HeroSection from "../components/HeroSection";
import CommunitySection from "../components/CommunitySection";
import HomeArticlesSection from "../components/articles/HomeArticlesSection";
import FontStyleTest from "../components/FontStyleTest";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto space-y-8">
        <HeroSection />

        <div className="flex w-full">
          <Greeting />
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
