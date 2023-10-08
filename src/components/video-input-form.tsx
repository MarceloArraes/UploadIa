import { Label } from "@radix-ui/react-label";
import {
  Separator,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Slider } from "@radix-ui/react-slider";
import { FileVideo, Upload, Wand2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { loadFfmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";

export const VideoInputForm = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

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

    // const prompt = promptInputRef?.current?.value;

    if (!videoFile) return;

    // :D :D :) :)
    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData();

    data.append("file", audioFile);
    const response = await api.post("/videos", data);
    console.log("response ", response.data);
  };
  const previewURL = useMemo(() => {
    if (!videoFile) return null;

    return URL.createObjectURL(videoFile);
  }, [videoFile]);
  return (
    <>
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
            ref={promptInputRef}
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
    </>
  );
};
