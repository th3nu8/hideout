import { useState } from "react";
import { X, Code, Terminal, Database, Cookie, FileText, Network, FolderOpen, Beaker, MousePointer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface DevToolsProps {
  onClose: () => void;
}

export const DevTools = ({ onClose }: DevToolsProps) => {
  const [consoleMessages] = useState<string[]>([
    "DevTools initialized",
    "Browser environment active",
  ]);
  const [height, setHeight] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [inspecting, setInspecting] = useState(false);

  const getLocalStorageItems = () => {
    const items: { key: string; value: string }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        items.push({ key, value: localStorage.getItem(key) || '' });
      }
    }
    return items;
  };

  const getCookies = () => {
    return document.cookie.split(';').map(c => c.trim()).filter(c => c);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startY = e.clientY;
    const startHeight = height;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = startY - e.clientY;
      const newHeight = Math.max(200, Math.min(window.innerHeight - 100, startHeight + deltaY));
      setHeight(newHeight);
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-2xl z-[9999] flex flex-col"
      style={{ height: `${height}px` }}
    >
      {/* Resize Handle */}
      <div
        className={`h-1 bg-border hover:bg-primary cursor-ns-resize transition-colors ${isResizing ? 'bg-primary' : ''}`}
        onMouseDown={handleMouseDown}
      />
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <Button 
            variant={inspecting ? "default" : "ghost"} 
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setInspecting(!inspecting);
              if (!inspecting) {
                toast.info("Click an element to inspect it");
              }
            }}
          >
            <MousePointer className="w-4 h-4" />
          </Button>
          <Code className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Developer Tools</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="elements" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="w-full justify-start rounded-none border-b bg-background">
          <TabsTrigger value="elements" className="gap-2">
            <FileText className="w-4 h-4" />
            Elements
          </TabsTrigger>
          <TabsTrigger value="console" className="gap-2">
            <Terminal className="w-4 h-4" />
            Console
          </TabsTrigger>
          <TabsTrigger value="network" className="gap-2">
            <Network className="w-4 h-4" />
            Network
          </TabsTrigger>
          <TabsTrigger value="sources" className="gap-2">
            <FolderOpen className="w-4 h-4" />
            Sources
          </TabsTrigger>
          <TabsTrigger value="storage" className="gap-2">
            <Database className="w-4 h-4" />
            Storage
          </TabsTrigger>
          <TabsTrigger value="cookies" className="gap-2">
            <Cookie className="w-4 h-4" />
            Cookies
          </TabsTrigger>
          <TabsTrigger value="experimental" className="gap-2">
            <Beaker className="w-4 h-4" />
            Experimental
          </TabsTrigger>
        </TabsList>

        <TabsContent value="elements" className="flex-1 m-0 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="font-mono text-xs">
              <div className="text-muted-foreground">
                &lt;html&gt;<br />
                &nbsp;&nbsp;&lt;head&gt;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;title&gt;Hideout Browser&lt;/title&gt;<br />
                &nbsp;&nbsp;&lt;/head&gt;<br />
                &nbsp;&nbsp;&lt;body&gt;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;div id="browser-content"&gt;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;<br />
                &nbsp;&nbsp;&lt;/body&gt;<br />
                &lt;/html&gt;
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="console" className="flex-1 m-0 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-2 font-mono text-sm">
              {consoleMessages.map((msg, i) => (
                <div key={i} className="text-muted-foreground">
                  &gt; {msg}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="storage" className="flex-1 m-0 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Local Storage</h4>
                <div className="space-y-2">
                  {getLocalStorageItems().map((item, i) => (
                    <div key={i} className="bg-muted p-2 rounded font-mono text-xs">
                      <div className="text-primary font-semibold">{item.key}</div>
                      <div className="text-muted-foreground truncate">{item.value}</div>
                    </div>
                  ))}
                  {getLocalStorageItems().length === 0 && (
                    <div className="text-muted-foreground text-sm">No items in local storage</div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="network" className="flex-1 m-0 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-2">
              <div className="text-muted-foreground text-sm font-mono">
                Network requests will appear here...
              </div>
              <div className="bg-muted p-2 rounded text-xs">
                <div className="grid grid-cols-4 gap-2 font-semibold mb-2">
                  <div>Name</div>
                  <div>Status</div>
                  <div>Type</div>
                  <div>Size</div>
                </div>
                <div className="text-muted-foreground">No network activity recorded</div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="sources" className="flex-1 m-0 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-2 font-mono text-sm">
              <div className="text-muted-foreground">Page sources:</div>
              <div className="bg-muted p-2 rounded">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  <span>index.html</span>
                </div>
              </div>
              <div className="bg-muted p-2 rounded">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>styles.css</span>
                </div>
              </div>
              <div className="bg-muted p-2 rounded">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  <span>script.js</span>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="cookies" className="flex-1 m-0 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-2">
              {getCookies().map((cookie, i) => (
                <div key={i} className="bg-muted p-2 rounded font-mono text-xs">
                  {cookie}
                </div>
              ))}
              {getCookies().length === 0 && (
                <div className="text-muted-foreground text-sm">No cookies found</div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="experimental" className="flex-1 m-0 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <Beaker className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">No experimental features available yet</p>
                <p className="text-xs text-muted-foreground">Check back soon for new features!</p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
