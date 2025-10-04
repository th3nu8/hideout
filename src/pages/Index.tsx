import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center">
      <Navigation />

      {/* Main Content */}
      <main className="relative text-center space-y-12 animate-fade-in px-6 w-full max-w-3xl">
        {/* Big Hideout Text */}
        <div className="relative">
          <h1 className="text-9xl md:text-[12rem] font-bold tracking-tight relative">
            <span className="text-foreground">Hideout</span>
            <span className="text-primary">.</span>
          </h1>
        </div>

        {/* Search Bar with Button */}
        <div className="relative w-full flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            <Input 
              placeholder="search anything" 
              className="w-full h-16 pl-16 pr-6 text-lg bg-card border-border transition-colors rounded-2xl"
            />
          </div>
          <button className="h-16 px-8 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90 transition-colors">
            Search
          </button>
        </div>
      </main>
    </div>
  );
};

export default Index;
