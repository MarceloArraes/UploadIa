import { Button } from "./components/ui/button";
import { FileVideo, Github, Upload, Wand2 } from "lucide-react";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Slider } from "./components/ui/slider";

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">Upload.ia</h1>
        <div className="flex items-center gap-3 ">
          <span className="text-sm text-muted-foreground">
            Developed with love for Marcelo
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
          <form className="space-y-6">
            <label
              htmlFor="video"
              className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
            >
              <FileVideo className="h-4 w-4" />
              Upload Video{" "}
            </label>
            <input
              type="file"
              name="video"
              id="video"
              accept="video/mp4"
              className="sr-only"
            />
            <Separator />
            <div className="space-y-4">
              <Label htmlFor="transcription_prompt">Transcription Prompt</Label>
              <Textarea
                id="transcription_prompt"
                className="h-20 leading-relaxed resize-none"
                placeholder="Insert keywords cited on the video spaced by comma (,)"
              />
            </div>
            <Button type="submit" className="w-full">
              Upload Video
              <Upload className="h-4 w-4" />
            </Button>
          </form>
          <Separator />
          <form action="" className="space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a prompt..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"title"}>Title for Youtube</SelectItem>
                  <SelectItem value={"description"}>
                    Description for Youtube
                  </SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">
                You can customize this option soon
              </span>
            </div>
            <div className="space-y-2">
              <Label>Model</Label>
              <Select defaultValue="gpt3.5" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"gpt3.5"}>GPT 3.5-trubo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">
                You can customize this option soon
              </span>
            </div>
            <Separator />
            <div className="space-y-4">
              <Label>Temperature</Label>
              <Slider min={0} max={1} step={0.1} />
              <span className="block text-xs text-muted-foreground italic leading-relaxed">
                You can customize this option soon
              </span>
            </div>
            <Separator />
            <Button type="submit">
              Play
              <Wand2 className="h-4 w-4 " />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  );
}
