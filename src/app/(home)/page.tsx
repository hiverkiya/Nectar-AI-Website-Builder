import { ProjectForm } from '@/modules/home/ui/components/ProjectForm';
import { ProjectsList } from '@/modules/home/ui/components/ProjectList';
import Image from 'next/image';

const HomePage = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image src="/logo.svg" alt="Nectar" width={50} height={50} className="hidden md:block" />
        </div>
        <h1 className="text-center text-2xl font-semibold md:text-5xl">Build With Nectar</h1>
        <p className="md:text- text-muted-foreground text-center text-xl">
          Create Websites By Chatting With AI
        </p>
        <div className="mx-auto w-full max-w-3xl">
          <ProjectForm />
        </div>
      </section>
      <ProjectsList />
    </div>
  );
};
export default HomePage;
