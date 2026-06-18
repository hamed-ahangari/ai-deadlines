import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Calendar from "./pages/Calendar";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen w-full flex flex-col" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <footer className="text-center text-sm text-neutral-400 py-4 border-t border-neutral-200">
            Forked from{" "}
            <a
              href="https://huggingface.co/spaces/ai-deadlines/ai-deadlines"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Hugging Face AI Deadlines
            </a>
          </footer>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
