import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Gamepad2, Flame, TrendingUp, Sparkles, Star } from "lucide-react";

const games = [
  { id: 1, name: "Slope", category: "Action", popularity: "hot" },
  { id: 2, name: "Among Us", category: "Multiplayer", popularity: "popular" },
  { id: 3, name: "1v1.lol", category: "Shooter", popularity: "hot" },
  { id: 4, name: "Subway Surfers", category: "Runner", popularity: "popular" },
  { id: 5, name: "Retro Bowl", category: "Sports", popularity: "trending" },
  { id: 6, name: "Drive Mad", category: "Racing", popularity: "hot" },
  { id: 7, name: "Monkey Mart", category: "Strategy", popularity: "new" },
  { id: 8, name: "Cookie Clicker", category: "Idle", popularity: "popular" },
  { id: 9, name: "Bitlife", category: "Simulation", popularity: "trending" },
  { id: 10, name: "Crossy Road", category: "Arcade", popularity: "new" },
  { id: 11, name: "Shell Shockers", category: "Shooter", popularity: "hot" },
  { id: 12, name: "Tunnel Rush", category: "Action", popularity: "popular" },
];

const getBadgeConfig = (popularity: string) => {
  switch (popularity) {
    case "hot":
      return { 
        variant: "default" as const, 
        icon: Flame, 
        className: "bg-red-600 text-white border-red-500 animate-pulse"
      };
    case "popular":
      return { 
        variant: "secondary" as const, 
        icon: Star, 
        className: "bg-yellow-600 text-white border-yellow-500"
      };
    case "trending":
      return { 
        variant: "outline" as const, 
        icon: TrendingUp, 
        className: "bg-blue-600 text-white border-blue-500"
      };
    case "new":
      return { 
        variant: "secondary" as const, 
        icon: Sparkles, 
        className: "bg-green-600 text-white border-green-500"
      };
    default:
      return { 
        variant: "secondary" as const, 
        icon: Star, 
        className: ""
      };
  }
};

const Games = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !activeFilter || game.popularity === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="space-y-6 mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground">
            Games
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Play unblocked games anywhere, anytime. No restrictions, just fun.
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search games..." 
              className="pl-10 bg-card border-border transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(null)}
              className="transition-colors"
            >
              All
            </Button>
            <Button
              variant={activeFilter === "hot" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("hot")}
              className="transition-colors"
            >
              <Flame className="w-4 h-4 mr-1" />
              Hot
            </Button>
            <Button
              variant={activeFilter === "popular" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("popular")}
              className="transition-colors"
            >
              <Star className="w-4 h-4 mr-1" />
              Popular
            </Button>
            <Button
              variant={activeFilter === "trending" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("trending")}
              className="transition-colors"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Trending
            </Button>
            <Button
              variant={activeFilter === "new" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("new")}
              className="transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredGames.map((game, index) => (
            <Card
              key={game.id}
              className="group p-4 bg-card border-border hover:border-primary/20 transition-all duration-300 cursor-pointer animate-fade-in relative"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Popularity Badge */}
              {game.popularity && (() => {
                const config = getBadgeConfig(game.popularity);
                const BadgeIcon = config.icon;
                return (
                  <Badge 
                    variant={config.variant}
                    className={`absolute top-2 right-2 text-xs uppercase z-10 flex items-center gap-1 pointer-events-none ${config.className}`}
                  >
                    <BadgeIcon className="w-3 h-3" />
                    {game.popularity}
                  </Badge>
                );
              })()}

              {/* Game Icon Placeholder */}
              <div className="aspect-square mb-3 rounded-lg bg-secondary/50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                <Gamepad2 className="w-8 h-8 text-muted-foreground group-hover:text-primary/70 transition-colors" />
              </div>

              {/* Game Info */}
              <h3 className="text-sm font-semibold mb-1 group-hover:text-primary/80 transition-colors truncate">
                {game.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{game.category}</p>
            </Card>
          ))}
        </div>

        {/* No results message */}
        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No games found matching "{searchQuery}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Games;
