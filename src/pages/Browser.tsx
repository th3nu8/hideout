import { useState, useRef, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TabBar } from "@/components/browser/TabBar";
import { NavigationBar } from "@/components/browser/NavigationBar";
import { BrowserHelp } from "@/components/browser/BrowserHelp";
import { BrowserHistory } from "@/components/browser/BrowserHistory";
import { supabase } from "@/integrations/supabase/client";
import { usePageTitle } from "@/hooks/use-page-title";
import eruda from "eruda";

interface Tab {
  id: number;
  title: string;
  url: string;
  proxiedUrl: string;
  proxiedHtml?: string;
  history: string[];
  historyIndex: number;
  pinned?: boolean;
}

const Browser = () => {
  usePageTitle('Browser');
  const navigate = useNavigate();
  const location = useLocation();
  const initialUrl = (location.state as { initialUrl?: string })?.initialUrl;

  // --- State Initialization ---
  
  const [tabs, setTabs] = useState<Tab[]>(() => {
    const saved = localStorage.getItem('hideout_browser_tabs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : [{ id: 1, title: "New Tab", url: "", proxiedUrl: "", history: [], historyIndex: -1 }];
      } catch { return [{ id: 1, title: "New Tab", url: "", proxiedUrl: "", history: [], historyIndex: -1 }]; }
    }
    return [{ id: 1, title: "New Tab", url: "", proxiedUrl: "", history: [], historyIndex: -1 }];
  });

  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id || 1);
  const [urlInput, setUrlInput] = useState("");
  const [engine, setEngine] = useState<"google" | "duckduckgo" | "bing" | "yahoo" | "yandex" | "brave">("google");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [browserHistory, setBrowserHistory] = useState<{url: string, title: string, timestamp: number}[]>([]);
  const [showMaxTabsDialog, setShowMaxTabsDialog] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [closedTabs, setClosedTabs] = useState<Tab[]>([]);
  const [showDevTools, setShowDevTools] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const erudaContainerRef = useRef<HTMLDivElement>(null);
  const nextTabId = useRef(tabs.length + 1);

  const activeTab = tabs.find(t => t.id === activeTabId);

  // --- Logic Functions ---

  const processUrl = (input: string): string => {
    if (!input) return "";
    if (input.startsWith('hideout://')) return input;
    
    // Check if it's a search query: no dots or contains spaces
    const isSearch = !input.includes('.') || input.includes(' ');
    
    if (isSearch) {
      const q = encodeURIComponent(input);
      const engines = {
        google: `https://www.google.com/search?q=${q}`,
        duckduckgo: `https://duckduckgo.com/?q=${q}`,
        bing: `https://www.bing.com/search?q=${q}`,
        yahoo: `https://search.yahoo.com/search?p=${q}`,
        yandex: `https://yandex.com/search/?text=${q}`,
        brave: `https://search.brave.com/search?q=${q}`
      };
      return engines[engine];
    }

    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      return `https://${input}`;
    }
    return input;
  };

  const loadUrl = async (url: string, tabId: number) => {
    if (!url) return;
    setLoading(true);
    setError(null);

    // Handle internal pages
    if (url.startsWith('hideout://')) {
      setTabs(prev => prev.map(tab => tab.id === tabId ? { ...tab, url, title: url.replace('hideout://', 'Hideout | '), proxiedHtml: undefined } : tab));
      setLoading(false);
      return;
    }

    try {
      const { data, error: proxyError } = await supabase.functions.invoke('web-proxy', {
        body: { url }
      });

      if (proxyError || !data?.success) throw new Error('Proxy failed');

      setTabs(prev => prev.map(tab => {
        if (tab.id === tabId) {
          const newHistory = tab.history.slice(0, tab.historyIndex + 1);
          newHistory.push(url);
          return {
            ...tab,
            url,
            proxiedHtml: data.html,
            title: new URL(url).hostname,
            history: newHistory,
            historyIndex: newHistory.length - 1
          };
        }
        return tab;
      }));
    } catch (err: any) {
      setError("Failed to load page. The proxy might be down or the URL is invalid.");
      toast.error("Navigation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    const processed = processUrl(urlInput);
    if (processed && activeTab) {
      loadUrl(processed, activeTab.id);
    }
  };

  // --- Effects ---

  useEffect(() => {
    if (initialUrl && activeTab) {
      const processed = processUrl(initialUrl);
      setUrlInput(processed);
      loadUrl(processed, activeTab.id);
    }
  }, []);

  useEffect(() => {
    if (activeTab) setUrlInput(activeTab.url);
  }, [activeTabId]);

  return (
    <div className="h-screen flex flex-col bg-background relative">
      <div className="flex items-center border-b bg-muted/30 px-2 py-1">
        <div className="flex-1 min-w-0 overflow-x-auto">
          <TabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onTabSelect={setActiveTabId}
            onTabClose={(id) => setTabs(tabs.filter(t => t.id !== id))}
            onNewTab={() => {
              const newTab = { id: Date.now(), title: "New Tab", url: "", proxiedUrl: "", history: [], historyIndex: -1 };
              setTabs([...tabs, newTab]);
              setActiveTabId(newTab.id);
            }}
          />
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="ml-2 h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <NavigationBar
        urlInput={urlInput}
        engine={engine}
        loading={loading}
        onUrlChange={setUrlInput}
        onNavigate={handleNavigate}
        onReload={() => activeTab && loadUrl(activeTab.url, activeTab.id)}
        onHome={() => setUrlInput("")}
        onEngineChange={setEngine}
        canGoBack={activeTab ? activeTab.historyIndex > 0 : false}
        canGoForward={activeTab ? activeTab.historyIndex < activeTab.history.length - 1 : false}
      />

      <div className="flex-1 bg-background relative overflow-hidden">
        {loading && <div className="absolute top-0 left-0 right-0 h-1 bg-primary animate-pulse z-50" />}
        
        {urlInput === "" || activeTab?.url === "" ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <h2 className="text-4xl font-bold opacity-20">Hideout Browser</h2>
            <div className="w-full max-w-md">
                <input 
                  className="w-full p-4 rounded-full border bg-secondary/50" 
                  placeholder={`Search with ${engine}...`}
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
                />
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            srcDoc={activeTab?.proxiedHtml}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-forms"
            title="Browser Content"
          />
        )}
      </div>
    </div>
  );
};

export default Browser;
