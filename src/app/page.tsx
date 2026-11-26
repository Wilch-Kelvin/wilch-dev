import { Academics } from '@/components/sections/Academics';
import { Contact } from '@/components/sections/Contact';
import { Demos } from '@/components/sections/Demos';
import { Hero } from '@/components/sections/Hero';
import { Projects } from '@/components/sections/Projects';
import { Resume } from '@/components/sections/Resume';

// The page only composes sections; content and logic live elsewhere.
export default function Home() {
  return (
    <main>
      <Hero />
      <Projects demos={<Demos />} />
      <Academics />
      <Resume />
      <Contact />
    </main>
  );
}
