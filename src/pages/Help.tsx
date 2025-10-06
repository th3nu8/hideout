import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Mail, MessageCircle, BookOpen, Globe, Shield, Zap } from "lucide-react";
import { GlobalChat } from "@/components/GlobalChat";

const Help = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <GlobalChat />

      <main className="pt-24 px-6 pb-12 max-w-4xl mx-auto">
        {/* Header */}
        <div className="space-y-6 mb-12 animate-fade-in text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Help Center</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions and get support.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <a href="https://discord.gg/HkbVraQH89" target="_blank" rel="noopener noreferrer">
            <Card className="p-6 bg-card border-border hover:border-primary/20 transition-all cursor-pointer group">
              <MessageCircle className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">Join our Discord community</p>
            </Card>
          </a>
          <a href="mailto:hideout-network-buisness@hotmail.com">
            <Card className="p-6 bg-card border-border hover:border-primary/20 transition-all cursor-pointer group">
              <Mail className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">Contact Us</h3>
              <p className="text-sm text-muted-foreground">Get in touch with support</p>
            </Card>
          </a>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="p-6 bg-card border-border">
            <Globe className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Browser</h3>
            <p className="text-sm text-muted-foreground">Access any website with our secure proxy browser. Up to 5 tabs supported!</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <Zap className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Games & Apps</h3>
            <p className="text-sm text-muted-foreground">Play unblocked games and use apps directly in your browser.</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <Shield className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Privacy First</h3>
            <p className="text-sm text-muted-foreground">We value your privacy and security. No tracking, no data collection.</p>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="p-8 bg-card border-border mb-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I access blocked games?</AccordionTrigger>
              <AccordionContent>
                Simply navigate to the Games section and click on any game to start playing. 
                All games are accessible without restrictions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is Hideout safe to use?</AccordionTrigger>
              <AccordionContent>
                Yes, Hideout is completely safe. We don't collect any personal information 
                and all connections are secure.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I use this on my school computer?</AccordionTrigger>
              <AccordionContent>
                Hideout is designed to work on most school networks, but availability may 
                depend on your school's specific restrictions and policies.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How does the browser feature work?</AccordionTrigger>
              <AccordionContent>
                The browser feature allows you to access websites through a proxy, 
                helping you bypass network restrictions while maintaining privacy. You can open up to 5 tabs and navigate just like a regular browser!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Do I need to create an account?</AccordionTrigger>
              <AccordionContent>
                No account is required to use most features. However, creating an account 
                allows you to save your favorites, use the global chat, and sync your browser data.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>How do I use the global chat?</AccordionTrigger>
              <AccordionContent>
                Click the chat button in the bottom left corner to open global chat. You can view messages without an account, but you need to be logged in to send messages. Chat history is limited to the last 100 messages.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger>Can I request games or report bugs?</AccordionTrigger>
              <AccordionContent>
                Yes! On the Games page, you'll find a "Request Game" button. On the home page, there's a "Report Bug" button below the search bar. Both will help you send feedback to our team.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger>What keyboard shortcuts are available?</AccordionTrigger>
              <AccordionContent>
                In the browser: Alt+T (new tab), Alt+W (close tab), Alt+R (reload), Alt+L (focus address bar), Alt+← (back), Alt+→ (forward), Alt+Shift+T (reopen closed tab).
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        {/* Browser Help Card */}
        <Card className="p-8 bg-card border-border">
          <h2 className="text-2xl font-bold mb-4">Browser Help</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Internal Pages</h3>
              <p className="text-muted-foreground">You can access special browser pages using hideout:// URLs:</p>
              <ul className="list-disc list-inside text-muted-foreground ml-4 mt-2">
                <li>hideout://help - Browser help and documentation</li>
                <li>hideout://settings - Browser settings</li>
                <li>hideout://history - View your browsing history</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Tab Management</h3>
              <p className="text-muted-foreground">
                Right-click on any tab for more options like duplicate, pin, or close other tabs. You can have up to 5 tabs open at once.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Bookmarks & History</h3>
              <p className="text-muted-foreground">
                Click the star icon to bookmark pages, and use the history menu to revisit sites. Your data is saved locally and synced to your account if you're logged in.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Help;
