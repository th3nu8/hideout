import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Flame, Star, Sparkles, Filter, Maximize } from "lucide-react";
import { RequestGameDialog } from "@/components/RequestGameDialog";
import { GlobalChat } from "@/components/GlobalChat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import gamesData from "@/data/games.json";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Game = {
  name: string;
  icon: string;
  popularity: string[];
  categories: string[];
  gameLink: string;
};

const games: Game[] = gamesData;

const getBadgeConfig = (popularity: string) => {
  switch (popularity) {
    case "hot":
      return { variant: "default" as const, icon: Flame, className: "bg-red-500/20 text-red-400 border-red-500/30" };
    case "trending":
      return { variant: "default" as const, icon: TrendingUp, className: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
    case "popular":
      return { variant: "default" as const, icon: TrendingUp, className: "bg-green-500/20 text-green-400 border-green-500/30" };
    case "new":
      return { variant: "default" as const, icon: Sparkles, className: "bg-purple-500/20 text-purple-400 border-purple-500/30" };
    default:
      return { variant: "secondary" as const, icon: Star, className: "" };
  }
};

const Games = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const gameParam = searchParams.get("game");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (gameParam) {
      const foundGame = games.find(
        (g) => g.name.toLowerCase().replace(/\s+/g, '-') === gameParam
      );
      setCurrentGame(foundGame || null);
    } else {
      setCurrentGame(null);
    }
  }, [gameParam]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!currentGame) return;

      const storedUser = localStorage.getItem('hideout_user') || sessionStorage.getItem('hideout_user');
      if (!storedUser) {
        setIsFavorited(false);
        return;
      }

      try {
        const user = JSON.parse(storedUser);
        const { data } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('game_name', currentGame.name)
          .single();

        setIsFavorited(!!data);
      } catch (error) {
        setIsFavorited(false);
      }
    };

    checkFavorite();
  }, [currentGame]);

  const handleGameClick = (gameName: string) => {
    const gameSlug = gameName.toLowerCase().replace(/\s+/g, '-');
    setSearchParams({ game: gameSlug });
  };

  const handleFullscreen = () => {
    const iframe = document.getElementById("game-iframe") as HTMLIFrameElement;
    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  const filteredGames = games
    .filter((game) => {
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || game.categories.includes(categoryFilter);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aIsHotOrPopular = a.popularity.includes("hot") || a.popularity.includes("popular");
      const bIsHotOrPopular = b.popularity.includes("hot") || b.popularity.includes("popular");
      if (aIsHotOrPopular && !bIsHotOrPopular) return -1;
      if (!aIsHotOrPopular && bIsHotOrPopular) return 1;
      return 0;
    });

  const allCategories = Array.from(new Set(games.flatMap(game => game.categories)));

  const handleFavorite = async () => {
    const storedUser = localStorage.getItem('hideout_user') || sessionStorage.getItem('hideout_user');
    
    if (!storedUser) {
      setShowLoginPrompt(true);
      return;
    }

    if (!currentGame) return;

    try {
      const user = JSON.parse(storedUser);

      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('game_name', currentGame.name);

        if (error) throw error;

        setIsFavorited(false);
        toast({
          title: "Removed from Favorites",
          description: `${currentGame.name} has been removed from your favorites`,
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, game_name: currentGame.name });

        if (error) throw error;

        setIsFavorited(true);
        toast({
          title: "Added to Favorites",
          description: `${currentGame.name} has been added to your favorites`,
        });
      }
    } catch (error) {
      console.error('Error managing favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginPrompt(false);
    window.location.href = "/auth";
  };

  // If a game is selected, show the game player
  if (currentGame) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 px-4 sm:px-6 pb-12 max-w-4xl mx-auto">
          <div className="space-y-3">
            {/* Game Title with Icon */}
            <div className="w-full bg-card rounded-lg border border-border p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img src={currentGame.icon} alt={currentGame.name} className="w-full h-full object-cover" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{currentGame.name}</h1>
            </div>
            
            {/* Game Iframe */}
            <div className="w-full bg-card rounded-lg overflow-hidden border border-border" style={{ aspectRatio: '16/9' }}>
              <iframe
                id="game-iframe"
                src={currentGame.gameLink}
                className="w-full h-full"
                title={currentGame.name}
                allowFullScreen
              />
            </div>

            {/* Controls */}
            <div className="w-full bg-card rounded-lg border border-border p-4 flex gap-3">
              <Button
                onClick={handleFullscreen}
                className="gap-2 hover:scale-105 transition-transform"
              >
                <Maximize className="w-4 h-4" />
                Fullscreen
              </Button>
              <Button
                onClick={handleFavorite}
                className={`gap-2 transition-all duration-300 ${
                  isFavorited 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black shadow-lg shadow-yellow-500/50 scale-105' 
                    : 'bg-gradient-to-r from-yellow-500/80 to-yellow-600/80 hover:from-yellow-500 hover:to-yellow-600 text-black hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105'
                }`}
              >
                <Star className={`w-4 h-4 transition-all duration-300 ${isFavorited ? 'fill-current animate-pulse' : ''}`} />
                {isFavorited ? 'Favorited' : 'Favorite'}
              </Button>
            </div>

            {/* Login Prompt Dialog */}
            <AlertDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
              <AlertDialogContent className="bg-card border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle>Account Required</AlertDialogTitle>
                  <AlertDialogDescription>
                    You need to create an account or login to use the favorites feature.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction onClick={handleLoginRedirect}>
                    Go to Login
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </main>
      </div>
    );
  }

  // Show games listing

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <GlobalChat />

      <main className="pt-24 px-4 sm:px-6 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="space-y-6 mb-12 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Games</h1>
              <p className="text-muted-foreground text-lg">
                Discover and play amazing games
              </p>
            </div>
            <RequestGameDialog />
          </div>

          {/* Search and Filters */}
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search games..." 
                className="pl-10 bg-card border-border transition-colors"
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

        {/* Games Grid - Poki style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredGames.map((game, index) => {
            return (
              <div
                key={game.name}
                onClick={() => handleGameClick(game.name)}
                className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 hover:scale-105 transition-all duration-200 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 20}ms` }}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={game.icon} 
                    alt={game.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                    {game.name}
                  </h3>
                  {game.categories[0] && (
                    <p className="text-xs text-muted-foreground truncate">
                      {game.categories[0]}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* No results */}
        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No games found matching your filters</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Games;
