import ErrorTester from "../components/ErrorTester";
import Logo from "../components/Logo";
import Greeting from "../components/Greeting";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="relative flex flex-col items-center text-center overflow-hidden rounded-lg min-h-[400px]">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://res.cloudinary.com/dtweazqf2/image/upload/q_auto,f_auto/v1754661544/SuburbanGardener/IMG_7791_nl7dzw.jpg"
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source
              src="https://res.cloudinary.com/dtweazqf2/video/upload/f_auto,q_auto/v1754668830/SuburbanGardener/bannerboomerang_ebv27k.webm"
              type="video/webm"
            />
            Your browser does not support the video tag.
          </video>

          {/* Content Overlay */}
          <div className="relative z-10 w-full p-8">
            <div className="flex flex-row sm:flex-col">
              <Logo
                className="me-6 sm:me-0 mb-0 sm:my-24 h-[100px] sm:h-[300px]"
                src="https://res.cloudinary.com/dtweazqf2/image/upload/c_fill,t_transparent-white-alpha-dim,q_auto,f_auto/v1755011510/SuburbanGardener/suburban_gardener_s4c8gy.png"
              />
              <div className="flex sm:hidden w-full px-4 sm:px-24">
                <Greeting />
              </div>
            </div>
          </div>
        </header>
        <div className="hidden sm:flex w-full">
          <Greeting />
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-8">
            <ErrorTester />
          </div>
        )}

        <section className="mt-12 p-6 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-bold mb-4 text-secondary-700 dark:text-secondary-300">
            Font and Style Test
          </h2>
          <div className="space-y-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              Extra small text for captions and fine print. (11px - Extra Small)
            </p>
            <p className="text-sm italic text-neutral-600 dark:text-neutral-400">
              Small text for secondary information. (12px - Small)
            </p>
            <p className="text-base text-foreground-light dark:text-foreground-dark">
              This is the default text size that should be used for most body
              content. The spacing and typography should be clean and readable.
              (14px - Default)
            </p>
            <p className="text-lg text-primary-700 dark:text-primary-300">
              This is large text for emphasis or headings. (16px - Large)
            </p>
            <p className="text-xl font-bold text-primary-700 dark:text-primary-300">
              This is extra large bold text for major headings. (18px - Extra
              Large)
            </p>
            <div className="flex gap-4 flex-wrap">
              <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors">
                Primary Button
              </button>
              <button className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-md transition-colors">
                Secondary Button
              </button>
              <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors">
                Outline Button
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
