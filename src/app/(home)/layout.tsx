import { Navbar } from '@/modules/home/ui/components/Navbar';

interface Props {
  children: React.ReactNode;
}
const Layout = ({ children }: Props) => {
  return (
    <main className="flex max-h-screen min-h-screen flex-col">
      <Navbar />
      <div className="bg-background absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(circle,#e5e7eb_2px,transparent_2px)] [background-size:40px_40px] dark:bg-[radial-gradient(circle,#4b5563_2px,transparent_2px)]" />

      <div className="flex flex-1 flex-col px-4 pb-4">{children}</div>
    </main>
  );
};

export default Layout;
