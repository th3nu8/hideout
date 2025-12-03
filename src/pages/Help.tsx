import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { usePageTitle } from "@/hooks/use-page-title";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Mail, MessageCircle, Globe, Shield, Zap, Gamepad2, Bot, Palette, Keyboard } from "lucide-react";
import { GlobalChat } from "@/components/GlobalChat";
import { GridBackground } from "@/components/GridBackground";

const Help = () => {
  usePageTitle('Help');
  return (
    <div className="min-h-screen bg-background relative">
      <GridBackground />
      <Navigation />
      <GlobalChat />

      <main className="pt-24 px-6 pb-12 max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="space-y-6 mb-12 animate-fade-in text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Help Center</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions and get support for Hideout.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <a href="https://discord.gg/HkbVraQH89" target="_blank" rel="noopener noreferrer">
            <Card className="p-6 bg-card border-border hover:border-primary/20 transition-all cursor-pointer group">
              <MessageCircle className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Discord Community</h3>
              <p className="text-sm text-muted-foreground">Join our Discord for live support and updates</p>
            </Card>
          </a>
          <a href="https://github.com/Hideout-Network/hideout/issues/new" target="_blank" rel="noopener noreferrer">
            <Card className="p-6 bg-card border-border hover:border-primary/20 transition-all cursor-pointer group">
              <Mail className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Report Issue</h3>
              <p className="text-sm text-muted-foreground">Submit bug reports or feature requests</p>
            </Card>
          </a>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="p-6 bg-card border-border">
            <Gamepad2 className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Games</h3>
            <p className="text-sm text-muted-foreground">Browse and play games from multiple sources. Favorite games for quick access. Use "Feeling Lucky" for random picks!</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <Globe className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Browser</h3>
            <p className="text-sm text-muted-foreground">Access websites through our built-in browser with tab support. Navigate freely with keyboard shortcuts.</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <Bot className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">AI Chat</h3>
            <p className="text-sm text-muted-foreground">Chat with AI models. Auto mode selects the best model for your needs. Supports image uploads!</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <Zap className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Apps</h3>
            <p className="text-sm text-muted-foreground">Access useful web apps and tools directly. Quick search to find what you need.</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <Palette className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Themes & Addons</h3>
            <p className="text-sm text-muted-foreground">Customize Hideout with themes and addons. Visit Settings to change themes.</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <Shield className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Privacy</h3>
            <p className="text-sm text-muted-foreground">Your privacy matters. We don't track you. Use incognito mode for extra privacy.</p>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="p-8 bg-card border-border mb-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I play games?</AccordionTrigger>
              <AccordionContent>
                Navigate to the Games page from the navigation bar. Browse through games from multiple sources or use the search bar to find specific games. Click on any game to play it. You can favorite games by clicking the heart icon for quick access later.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What is the AI feature?</AccordionTrigger>
              <AccordionContent>
                The AI button in the navigation opens a chat interface where you can talk to various AI models. By default, "Auto" mode is selected which automatically picks the best model based on your message - vision models for images, powerful models for complex prompts. You need to add a Groq API key (free at console.groq.com) to use this feature.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How do I use the browser?</AccordionTrigger>
              <AccordionContent>
                Click "Browser" in the navigation to access the built-in browser. You can type URLs or search queries in the address bar. The browser supports multiple tabs (up to 5) and has keyboard shortcuts for quick navigation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How do I add shortcuts on the home page?</AccordionTrigger>
              <AccordionContent>
                On the home page, you'll see shortcut tiles below the search bar. Click the "+" button to add a new shortcut with a custom name and URL. Hover over any shortcut and click the X to remove it. Shortcuts are saved and persist across sessions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Why are there duplicate games?</AccordionTrigger>
              <AccordionContent>
                Games come from multiple sources (List 1, List 2, List 3), so some games may appear more than once. When you click a game, it will correctly open the specific version you clicked on, not a random duplicate.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>How do I change themes?</AccordionTrigger>
              <AccordionContent>
                Go to Settings (click Settings in the navigation) and look for the Appearance section. You can select from various themes in the dropdown menu. Theme changes apply immediately.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger>How do I report bugs or request games?</AccordionTrigger>
              <AccordionContent>
                Click the menu icon (three lines) at the bottom-right corner of any page. You'll find options to Report Bug, Request Game, visit our GitHub, Discord, and Help page.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger>What keyboard shortcuts are available?</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-start gap-2">
                  <Keyboard className="w-4 h-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="mb-2">In the browser, press Alt+Z first, then:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>T - New tab</li>
                      <li>W - Close current tab</li>
                      <li>R - Reload page</li>
                      <li>L - Focus address bar</li>
                      <li>← - Go back</li>
                      <li>→ - Go forward</li>
                      <li>F - Toggle fullscreen</li>
                      <li>I - Open dev tools</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        {/* Browser Help Card */}
        <Card className="p-8 bg-card border-border">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Browser Documentation</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            For detailed browser documentation and advanced help, visit the built-in help page:
          </p>
          
          <a 
            href="/browser?url=hideout://help"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span className="font-semibold">hideout://help</span>
          </a>
        </Card>
      </main>
    </div>
  );
};

export default Help;