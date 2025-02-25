import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://huggingface.co/front/assets/huggingface_logo.svg" 
                alt="Hugging Face Logo" 
                className="h-8 w-8"
              />
              <span className="text-2xl font-bold text-primary">
                AI Conference Deadlines
              </span>
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link
                to="/calendar"
                className="text-neutral-600 hover:text-primary flex items-center gap-2"
              >
                <CalendarDays className="h-5 w-5" />
                Calendar
              </Link>
            </nav>
          </div>
          <div className="max-w-lg w-full lg:max-w-xs">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <Input
                type="search"
                placeholder="Search conferences..."
                className="pl-10"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-neutral-600 py-4">
            Countdowns to top CV/NLP/ML/Robotics/AI conference deadlines. To add/edit a conference, send in a{' '}
            <a 
              href="https://github.com/huggingface/ai-deadlines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              pull request
            </a>.
            <br />
            P.S. Is your paper already on Arxiv? Feel free to{' '}
            <a
              href="https://hf.co/papers/submit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              submit
            </a>
            {' '}it to{' '}
            <a
              href="https://hf.co/papers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              hf.co/papers
            </a>
            {' '}and upload your artifacts such as{' '}
            <a
              href="https://huggingface.co/docs/hub/en/models-uploading"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              models
            </a>
            {', '}
            <a
              href="https://huggingface.co/docs/datasets/loading"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              datasets
            </a>
            {' '}and{' '}
            <a
              href="https://huggingface.co/docs/hub/en/spaces-sdks-gradio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              demos
            </a>
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
