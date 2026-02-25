"use client";

import { useState } from "react";
import { marked } from "marked";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export function ChangelogEditor({
  projectId,
  onSubmit,
}: {
  projectId: string;
  onSubmit: (formData: FormData) => void;
}) {
  const [changes, setChanges] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    const res = await fetch("/api/ai/generate-changelog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ changes }),
    });

    const data = await res.json();
    if (data.markdown) setContent(data.markdown);
    setLoading(false);
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <input type="hidden" name="projectId" value={projectId} />
      <Input name="title" required placeholder="Release title" />
      <Input name="version" required placeholder="v1.2.0" />
      <Input name="tags" placeholder="feature, bugfix, improvement, breaking" />

      <Textarea
        value={changes}
        onChange={(e) => setChanges(e.target.value)}
        rows={4}
        placeholder="Paste commit bullets or plain text changes..."
      />
      <Button type="button" variant="outline" onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate with AI"}
      </Button>

      <Tabs defaultValue="write">
        <TabsList>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="mt-4">
          <Textarea
            name="content"
            rows={12}
            placeholder="Write markdown release notes..."
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-4">
          <div
            className="prose prose-invert max-w-none rounded border border-slate-700/60 p-4"
            dangerouslySetInnerHTML={{ __html: marked.parse(content || "Nothing to preview yet.") as string }}
          />
        </TabsContent>
      </Tabs>

      <div className="flex gap-3">
        <Button type="submit" name="status" value="draft" variant="outline">
          Save Draft
        </Button>
        <Button type="submit" name="status" value="published">
          Publish
        </Button>
      </div>
    </form>
  );
}
