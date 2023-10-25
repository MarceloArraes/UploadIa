import { api } from "@/lib/axios";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface Prompt {
  id: string;
  title: string;
  template: string;
}
interface PromptSelectProps {
  onPromptSelected: (template: string) => void;
}
export const PromptSelect = (props: PromptSelectProps) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    api.get("/prompts").then((response) => {
      console.log("response.data prompts", response.data);
      setPrompts(response.data);
    });
  }, []);

  const handlePromptSelected = (promptId: string) => {
    const selectedPrompt = prompts?.find((prompt) => prompt.id === promptId);

    if (!selectedPrompt) return;

    props.onPromptSelected(selectedPrompt.template);
  };

  return (
    <Select onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Select a prompt..." />
      </SelectTrigger>
      <SelectContent>
        {prompts?.map((prompt) => {
          return (
            <SelectItem key={prompt.id} value={prompt.id}>
              {prompt.title}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
