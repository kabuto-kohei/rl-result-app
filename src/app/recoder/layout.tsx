import RecoderFooterNav from '@/components/RecoderFooterNav';

export default function RecoderLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pb-20">
      {children}
      <RecoderFooterNav />
    </main>
  );
}
