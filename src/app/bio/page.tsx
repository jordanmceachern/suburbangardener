import Image from "next/image";
import { bioStyles } from "../../lib/tailwind";

export default function BioPage() {
  return (
    <main className="min-h-screen bg-background-light p-8 dark:bg-background-dark">
      <article className={bioStyles.shell}>
        <header
          className={bioStyles.banner}
          aria-label="Suburban Gardener header image"
        >
          <Image
            src="https://res.cloudinary.com/dtweazqf2/image/upload/c_fill,g_north,h_768,w_896,q_auto,f_auto/v1795378876/SuburbanGardener/n9jsiyw1wzrcr2vter00.jpg"
            alt="Suburban Gardener"
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className={bioStyles.bannerImage}
          />
        </header>

        <h1 className={bioStyles.title}>About Me</h1>

        <div className={bioStyles.body}>
          <p>
            Hi, I&apos;m Jordan McEachern, and I&apos;m the creator of Suburban
            Gardener.
          </p>
          <p>
            Since graduating from The University of New Brunswick, mechanical
            engineering program, I&apos;ve embarked on what turned out to be a
            rather unconventional career path. I&apos;ve now spent over 15 years
            working as an engineer — first in mechanical (where I completed the
            professional licensing requirements for the province of New
            Brunswick as well as the junior licensing for the state of Maine),
            then nearly a decade in software for a variety of companies. That
            combination of hands-on mechanical design and software engineering
            experience gave me the skills and vision for creating smart
            irrigation systems.
          </p>
          <p>
            Like a lot of people, I started vegetable gardening during the
            pandemic as a hobby. Due to my background, building my own
            irrigation systems was one of my first instincts. The prototypes I
            created captured rainwater, ran on a timer, and quietly kept my beds
            watered while I got on with my day job and life as a parent. It
            saved me hours of lugging watering cans daily, and allowed the
            family to go on vacation without worrying about the garden being
            looked after.
          </p>
          <p>
            I&apos;ve built this business to bring these same cost and time
            saving benefits to other suburban gardeners: irrigation custom
            designed to suit your personal garden needs, powered by sustainable
            energy, reduces your grocery bill, and saves you daily watering
            efforts.
          </p>
          <p>
            When I&apos;m not being a dad, I&apos;m in the garden or the
            workshop, and when I&apos;m not there, I&apos;m probably hitting the
            gym for training — I&apos;ve been a lifelong athlete since age 12
            (running, weightlifting, and in more recent years Tae Kwon Do and
            MMA sparring...). I try my best to apply the same commitment and
            dedication to my work, and I sincerely hope that the solutions
            I&apos;ve created make your life easier and garden care more
            sustainable when you have so many other important responsibilities.
          </p>
        </div>
      </article>
    </main>
  );
}
