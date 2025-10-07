import { useEffect, useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Maximize, Heart } from "lucide-react";
import gamesData from "@/data/games.json";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Game = {
  name: string;
  icon: string;
  popularity: string[];
  categories: string[];
  gameLink: string;
};

const games: Game[] = gamesData;

const GamePlayer = () => {
  const [searchParams] = useSearchParams();
  const gameParam = searchParams.get("game");
  const [game, setGame] = useState<Game | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('hideout_user') || sessionStorage.getItem('hideout_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    if (gameParam) {
      const foundGame = games.find(
        (g) => g.name.toLowerCase().replace(/\s+/g, '-') === gameParam
      );
      setGame(foundGame || null);
      
      // Check if favorite
      if (foundGame) {
        checkFavoriteStatus(foundGame.name);
      }
    }
  }, [gameParam, user]);

  const checkFavoriteStatus = async (gameName: string) => {
    const localFavorites = JSON.parse(localStorage.getItem('hideout_game_favorites') || '[]');
    setIsFavorite(localFavorites.includes(gameName));
  };

  const toggleFavorite = async () => {
    if (!game) return;

    const localFavorites = JSON.parse(localStorage.getItem('hideout_game_favorites') || '[]');
    const newIsFavorite = !isFavorite;

    if (newIsFavorite) {
      localFavorites.push(game.name);
      toast.success(`${game.name} added to favorites`);
    } else {
      const index = localFavorites.indexOf(game.name);
      if (index > -1) localFavorites.splice(index, 1);
      toast.success(`${game.name} removed from favorites`);
    }

    localStorage.setItem('hideout_game_favorites', JSON.stringify(localFavorites));
    setIsFavorite(newIsFavorite);

    // Sync to database if logged in
    if (user) {
      if (newIsFavorite) {
        await (supabase as any).from('favorites').insert([{ user_id: user.id, game_name: game.name }]);
      } else {
        await (supabase as any).from('favorites').delete().eq('user_id', user.id).eq('game_name', game.name);
      }
    }
  };

  const handleFullscreen = () => {
    const iframe = document.getElementById("game-iframe") as HTMLIFrameElement;
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      }
    }
  };

  if (!gameParam) {
    return <Navigate to="/games" replace />;
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Game Not Found</h1>
            <p className="text-muted-foreground">The game you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-foreground">{game.name}</h1>
          
          <div className="w-full aspect-video bg-card rounded-lg overflow-hidden border border-border">
            <iframe
              id="game-iframe"
              src={game.gameLink}
              className="w-full h-full"
              title={game.name}
              allowFullScreen
            />
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={handleFullscreen}
              className="gap-2"
              size="lg"
            >
              <Maximize className="w-5 h-5" />
              Fullscreen
            </Button>
            <Button
              onClick={toggleFavorite}
              variant={isFavorite ? "default" : "outline"}
              className="gap-2"
              size="lg"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? "Favorited" : "Favorite"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GamePlayer;
