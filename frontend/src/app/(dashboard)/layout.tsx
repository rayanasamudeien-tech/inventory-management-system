import Sidebar from '@/components/shared/Sidebar';
import Header from '@/components/shared/Header';
import { PageTransition } from '@/components/shared/PageTransition';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 mesh-gradient">
      <Sidebar />
      <Header />
      <main className="pl-64 pt-16 min-h-screen">
        <div className="p-8">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>
    </div>
  );
}
