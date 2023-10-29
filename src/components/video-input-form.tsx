import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@radix-ui/react-select";
import { Slider } from "@/components/ui/slider";
import { FileVideo, Upload, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { loadFfmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";
import { PromptSelect } from "./prompt-select";
import { useCompletion } from "ai/react";

type Status =
  | "waiting"
  | "converting"
  | "uploading"
  | "generating"
  | "success"
  | "error";

export const VideoInputForm = ({}: {}) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState<Status>("waiting");
  const [temperature, setTemperature] = useState(0.5);
  const [videoId, setVideoId] = useState<string | null>(null);

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: "https://upload-ai-backend.vercel.app/ai/complete",
    body: {
      videoId,
      temperature,
    },
    headers: {
      "Content-type": "application/json",
    },
  });

  const statusMessages: { [key in Status]: string } = {
    waiting: "Waiting...",
    converting: "Converting...",
    uploading: "Uploading",
    generating: "Generating",
    success: "Success",
    error: "Error",
  };

  const convertVideoToAudio = async (video: File) => {
    console.log("convert started. ");
    const ffmpeg = await loadFfmpeg();

    await ffmpeg.writeFile("input.mp4", await fetchFile(video));

    // ffmpeg.on("log", (log) => {
    //   console.log("log", log);
    // });

    ffmpeg.on("progress", (progress) => {
      console.log("Conver progress: ", Math.round(progress.progress * 100));
    });
    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const data = await ffmpeg.readFile("output.mp3");

    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "audio.mp3", {
      type: "audio/mpeg",
    });
    console.log("convert finished ");
    return audioFile;
  };

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }
    const selectedFile = files.item(0); // files[0]
    setVideoFile(selectedFile);
  };

  const handleUploadVideo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!videoFile) return;
    setStatus("converting");
    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData();

    data.append("file", audioFile);

    setStatus("uploading");

    const response = await api.post("/videos", data);
    console.log("response ", response.data);

    const videoId = response.data.video.id;
    setStatus("generating");

    const prompt = promptInputRef?.current?.value;
    await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    });
    setStatus("success");
    setVideoId(videoId);

    console.log("finished transcription");
  };

  const previewURL = useMemo(() => {
    if (!videoFile) return null;

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <>
      <div className="flex flex-col flex-1 gap-4">
        <div className="grid grid-rows-2 gap-2 flex-1">
          <Textarea
            className="resize-none p-4 leading-relaxed"
            placeholder="Prompt for IA"
            value={input}
            onChange={handleInputChange}
          />
          <Textarea
            className="resize-none p-4 leading-relaxed"
            placeholder="Result from IA"
            value={completion}
            readOnly
          />
        </div>
        <p className="text-sm text-muted-foreground">
          You can use the variable{" "}
          <code className="text-violet-500">`{"{transcription}"}`</code>on your
          prompt to add the content of the transcription of your selected video.
        </p>
      </div>
      <aside className="w-80 space-y-6">
        <form className="space-y-6" onSubmit={handleUploadVideo}>
          <label
            htmlFor="video"
            className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
          >
            {previewURL ? (
              <video
                src={previewURL}
                controls={false}
                className="pointer-events-none absolute inset-0"
              />
            ) : (
              <>
                <FileVideo className="h-4 w-4" />
                Upload Video{" "}
              </>
            )}
          </label>
          <input
            type="file"
            name="video"
            onChange={handleFileSelected}
            id="video"
            accept="video/mp4"
            className="sr-only"
          />
          <Separator />
          <div className="space-y-4">
            <Label htmlFor="transcription_prompt">Transcription Prompt</Label>
            <Textarea
              id="transcription_prompt"
              disabled={status != "waiting"}
              ref={promptInputRef}
              className="h-20 leading-relaxed resize-none"
              placeholder="Insert keywords cited on the video spaced by comma (,)"
            />
          </div>
          <Button
            data-success={status == "success"}
            disabled={status != "waiting"}
            type="submit"
            className="w-full data-[success=true]:bg-emerald-400"
          >
            {status == "waiting" ? (
              <>
                {" "}
                Upload Video
                <Upload className="h-4 w-4" />
              </>
            ) : (
              statusMessages[status]
            )}
          </Button>
        </form>
        <Separator />
        <form onSubmit={handleSubmit} action="" className="space-y-6">
          <div className="space-y-2">
            <Label>Prompt</Label>
            <PromptSelect onPromptSelected={setInput} />
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
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={[temperature]}
              onValueChange={(value) => setTemperature(value[0])}
            />
            <span className="block text-xs text-muted-foreground italic leading-relaxed">
              You can customize this option soon
            </span>
          </div>
          <Separator />
          <Button type="submit" disabled={isLoading}>
            Play
            <Wand2 className="h-4 w-4 " />
          </Button>
        </form>
      </aside>
    </>
  );
};
