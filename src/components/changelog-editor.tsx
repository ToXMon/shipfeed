"use client";

import { useState } from "react";
import { marked } from "marked";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

/* ─────────────────────────────────────────────────────────
 * CHANGELOG EDITOR STORYBOARD
 *
 *    0ms   form fields fade in
 *  100ms   AI generate button appears
 *  200ms   tabs appear with content
 *  +300ms  tab content transitions (on switch)
 * ───────────────────────────────────────────────────────── */

const TIMING = {
  formFields: 0,
  aiButton: 0.1,
  tabs: 0.2,
  tabContent: 0.3,
};

const SPRING = {
  type: "spring" as const,
  stiffness: 100,
  damping: 15,
  mass: 0.8,
};

const ENTER = {
  initialY: 16,
  initialOpacity: 0,
  targetY: 0,
  targetOpacity: 1,
};

const BUTTON_PRESS = {
  scale: 0.97,
};

const BUTTON_HOVER = {
  scale: 1.02,
  y: -1,
};

const TAB_CONTENT_VARIANTS = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

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
    <motion.form
      action={onSubmit}
      initial={{ opacity: ENTER.initialOpacity }}
      animate={{ opacity: ENTER.targetOpacity }}
      transition={{ ...SPRING, delay: TIMING.formFields }}
      className="space-y-4"
    >
      <input type="hidden" name="projectId" value={projectId} />
      
      <motion.div
        initial={{ opacity: 0, y: ENTER.initialY }}
        animate={{ opacity: 1, y: ENTER.targetY }}
        transition={{ ...SPRING, delay: TIMING.formFields + 0.05 }}
      >
        <Input name="title" required placeholder="Release title" className="bg-slate-900/50 border-slate-700/60" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: ENTER.initialY }}
        animate={{ opacity: 1, y: ENTER.targetY }}
        transition={{ ...SPRING, delay: TIMING.formFields + 0.1 }}
      >
        <Input name="version" required placeholder="v1.2.0" className="bg-slate-900/50 border-slate-700/60" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: ENTER.initialY }}
        animate={{ opacity: 1, y: ENTER.targetY }}
        transition={{ ...SPRING, delay: TIMING.formFields + 0.15 }}
      >
        <Input name="tags" placeholder="feature, bugfix, improvement, breaking" className="bg-slate-900/50 border-slate-700/60" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: ENTER.initialY }}
        animate={{ opacity: 1, y: ENTER.targetY }}
        transition={{ ...SPRING, delay: TIMING.aiButton }}
      >
        <Textarea
          value={changes}
          onChange={(e) => setChanges(e.target.value)}
          rows={4}
          placeholder="Paste commit bullets or plain text changes..."
          className="bg-slate-900/50 border-slate-700/60 resize-none"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: ENTER.initialY }}
        animate={{ opacity: 1, y: ENTER.targetY }}
        transition={{ ...SPRING, delay: TIMING.aiButton + 0.05 }}
      >
        <motion.div
          whileHover={!loading ? BUTTON_HOVER : undefined}
          whileTap={!loading ? BUTTON_PRESS : undefined}
        >
          <Button 
            type="button" 
            variant="outline" 
            onClick={generate} 
            disabled={loading}
            className="min-h-[44px] min-w-[44px]"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="h-4 w-4" />
                  </motion.div>
                  Generating...
                </motion.div>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Generate with AI
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: ENTER.initialY }}
        animate={{ opacity: 1, y: ENTER.targetY }}
        transition={{ ...SPRING, delay: TIMING.tabs }}
      >
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="bg-slate-900/60">
            <TabsTrigger 
              value="write" 
              className="data-[state=active]:bg-slate-800 min-h-[44px] px-4 transition-all duration-200"
            >
              Write
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="data-[state=active]:bg-slate-800 min-h-[44px] px-4 transition-all duration-200"
            >
              Preview
            </TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <TabsContent value="write" key="write" className="mt-4" asChild>
              <motion.div
n                variants={TAB_CONTENT_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <Textarea
                  name="content"
                  rows={12}
                  placeholder="Write markdown release notes..."
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-slate-900/50 border-slate-700/60 resize-none"
                />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="preview" key="preview" className="mt-4" asChild>
              <motion.div
n                variants={TAB_CONTENT_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <div
                  className="prose prose-invert max-w-none rounded border border-slate-700/60 bg-slate-900/50 p-4"
                  dangerouslySetInnerHTML={{ __html: marked.parse(content || "Nothing to preview yet.") as string }}
                />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: ENTER.initialY }}
        animate={{ opacity: 1, y: ENTER.targetY }}
        transition={{ ...SPRING, delay: TIMING.tabs + 0.1 }}
        className="flex gap-3 pt-2"
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={BUTTON_PRESS}
        >
          <Button 
            type="submit" 
            name="status" 
            value="draft" 
            variant="outline"
            className="min-h-[44px] px-6"
          >
            Save Draft
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={BUTTON_PRESS}
        >
          <Button 
            type="submit" 
            name="status" 
            value="published"
            className="min-h-[44px] px-6"
          >
            Publish
          </Button>
        </motion.div>
      </motion.div>
    </motion.form>
  );
}
