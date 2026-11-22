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
            src="https://res.cloudinary.com/dtweazqf2/image/upload/q_auto,f_auto/v1754661544/SuburbanGardener/IMG_7791_nl7dzw.jpg"
            alt="Suburban Gardener"
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className={bioStyles.bannerImage}
          />
        </header>

        <h1 className={bioStyles.title}>Meet Jordan McEachern</h1>

        <div className={bioStyles.body}>
          <p>
            Hi, I&apos;m Jordan McEachern, and I help suburban gardeners grow
            more food with less work through smart, custom-built rainwater
            irrigation systems.
          </p>
          <p>
            My path here is a little unusual. I spent over 15 years working as
            an engineer — first in mechanical design-and-build for mechanical
            systems (I was professionally licensed in New Brunswick and remain
            junior-licensed in Maine), and then nearly a decade as a software
            engineer for a variety of companies. That combination of hands-on
            mechanical design and software thinking turns out to be exactly what
            smart irrigation demands: reliable plumbing and hardware that can
            stand up to the elements, controlled by automation that just works.
          </p>
          <p>
            Like a lot of people, I started vegetable gardening during the
            pandemic. Unlike most, my first instinct was to build my own
            irrigation system — one that captured rainwater, ran on a timer, and
            quietly kept my beds watered while I got on with my life. It saved
            me hours of dragging hoses and made my harvests bigger and more
            consistent. Every year since, my garden has grown, and my grocery
            bill has shrunk.
          </p>
          <p>
            I built this business to bring that same result to other home
            gardeners: a system designed for your yard, built properly, and
            simple to live with. When I&apos;m not in the garden or the
            workshop, I&apos;m probably out running or lifting — I&apos;ve been
            a lifelong athlete (running, weightlifting, Tae Kwon Do, and some
            MMA sparring), and I bring that same discipline and persistence to
            everything I build.
          </p>
        </div>
      </article>
    </main>
  );
}
