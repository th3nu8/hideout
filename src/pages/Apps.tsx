import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { GlobalChat } from "@/components/GlobalChat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import appsData from "@/data/apps.json";

type App = {
  name: string;
  icon: string;
  category: string;
  description: string;
  link: string;
};

const apps: App[] = appsData as any;

const Apps = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredApps = apps
    .filter((app) => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || app.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

  const allCategories = Array.from(new Set(apps.map(app => app.category)));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <GlobalChat />
        <main className="pt-24 px-4 sm:px-6 pb-12 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground text-lg">Loading apps...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <GlobalChat />

      <main className="pt-24 px-4 sm:px-6 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="space-y-6 mb-12 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Apps</h1>
            <p className="text-muted-foreground text-lg">
              Discover useful applications
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search apps..." 
                className="pl-10 bg-card border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-card border-border">
                  <Filter className="w-4 h-4" />
                  {categoryFilter === "all" ? "All" : categoryFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border z-50">
                <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                  All
                </DropdownMenuItem>
                {allCategories.map((category) => (
                  <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Apps Grid - Poki style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredApps.map((app, index) => (
            <a
              key={app.name}
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 hover:scale-105 transition-all duration-200 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 20}ms` }}
            >
              <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
                <img 
                  src={app.icon} 
                  alt={app.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-2">
                <h3 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                  {app.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {app.category}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* No results */}
        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No apps found matching your filters</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Apps;
