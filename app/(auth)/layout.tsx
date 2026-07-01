import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["700"] });

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background p-4 gap-6">
      <h1
        className={`text-4xl font-bold text-center text-[#7c3aed] ${jakarta.className}`}
      >
        Where To Go, What To Do?
      </h1>
      {children}
    </div>
  );
}
