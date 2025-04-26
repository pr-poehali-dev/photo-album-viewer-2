
import { Link } from "react-router-dom";
import { ImageIcon } from "lucide-react";

export const TopNavigation = () => {
  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <ImageIcon className="h-6 w-6 text-primary" />
          <span className="font-medium text-lg">ФотоГалерея</span>
        </Link>
      </div>
    </header>
  );
};
