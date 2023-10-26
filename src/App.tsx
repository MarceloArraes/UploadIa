import { Button } from "./components/ui/button";
import { Github } from "lucide-react";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { VideoInputForm } from "./components/video-input-form";
import { useState } from "react";

export function App() {
  const [promptForAi, setPromptForAi] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">Upload.ia</h1>
        <div className="flex items-center gap-3 ">
          <span className="text-sm text-muted-foreground">
            Developed with love by Marcelo
          </span>
          <Separator orientation="vertical" className="h-6" />
          <Button variant={"outline"}>
            <Github className="h-4 w-4 mr-2" />
            BUTTON
          </Button>
        </div>
      </div>
      <main className="flex-1 p-6 flex gap-6">
        <VideoInputForm />
      </main>
    </div>
  );
}
