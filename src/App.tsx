import { Button } from "./components/ui/button";
import { Github } from "lucide-react";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { VideoInputForm } from "./components/video-input-form";

export function App() {
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
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-2 flex-1">
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Prompt for IA"
            />
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Result from IA"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            You can use the variable{" "}
            <code className="text-violet-500">`{"{transcription}"}`</code>on
            your prompt to add the content of the transcription of your selected
            video.
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <VideoInputForm />
        </aside>
      </main>
    </div>
  );
}
