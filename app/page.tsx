"use client";

import Header from "@/components/Header";
import { useScrollTo } from "@/hooks/use-scroll-to";
// import { Sandpack } from "@codesandbox/sandpack-react";
// import { dracula as draculaTheme } from "@codesandbox/sandpack-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { CheckIcon } from "@heroicons/react/16/solid";
import {
  ArrowLongRightIcon,
  ChevronDownIcon,
  PlayIcon,
  ArrowDownOnSquareIcon,
  ArrowPathIcon,
  ClipboardIcon,
  SunIcon,
  MoonIcon,
  CheckCircleIcon,
} from "@heroicons/react/20/solid";
import * as Select from "@radix-ui/react-select";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import LoadingDots from "../components/loading-dots";
import { Artifact } from "@/components/Artifact";

export default function Home() {
  let [status, setStatus] = useState<
    "initial" | "creating" | "created" | "updating" | "updated"
  >("initial");
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isClient, setClient] = useState(false);
  useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window;
    setDimensions({
      width,
      height,
    });
    setClient(true);
  }, []);

  let [generatedCode, setGeneratedCode] = useState("");
  let [modelUsedForInitialCode, setModelUsedForInitialCode] = useState("");
  let [ref, scrollTo] = useScrollTo();
  let [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  let [isDarkMode, setIsDarkMode] = useState(false);
  let [isConfettiActive, setIsConfettiActive] = useState(false);
  let [isCopied, setIsCopied] = useState(false);

  let [refreshKey, setRefreshKey] = useState(0);

  let loading = status === "creating" || status === "updating";

  const inAnimationMode = modelUsedForInitialCode === "animate";

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const downloadGeneratedCode = () => {
    const blob = new Blob([generatedCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "download.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setIsCopied(true);
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  async function generateCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (status !== "initial") {
      scrollTo({ delay: 0.5 });
    }

    setStatus("creating");
    setGeneratedCode("");

    let formData = new FormData(e.currentTarget);
    let model = formData.get("model");
    let prompt = formData.get("prompt") || "An 8-bit llama in a desert";
    if (typeof prompt !== "string" || typeof model !== "string") {
      return;
    }
    let newMessages = [{ role: "user", content: prompt }];

    console.log("request start");
    const chatRes = await fetch("/api/generateCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: newMessages,
        mode: model,
      }),
    });
    console.log("request end");
    if (!chatRes.ok) {
      throw new Error(chatRes.statusText);
    }

    // This data is a ReadableStream
    const data = chatRes.body;
    if (!data) {
      return;
    }

    if (prompt.toLowerCase().includes("llama")) {
      console.log("got llama");
      setIsConfettiActive(true);
    }

    let localGeneratedCode = ""; // For local access
    const onParse = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event") {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? "";
          localGeneratedCode += text; // update locally
          setGeneratedCode((prev) => prev + text); // update react state
        } catch (e) {
          console.error(e);
        }
      }
    };

    // https://web.dev/streams/#the-getreader-and-read-methods
    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParse);
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }

    newMessages = [
      ...newMessages,
      { role: "assistant", content: localGeneratedCode },
    ];

    setModelUsedForInitialCode(model);
    setMessages(newMessages);
    setStatus("created");

    console.log("Message Thread (mode:", model, ")");
    console.dir(newMessages);
  }

  async function modifyCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setStatus("updating");

    let formData = new FormData(e.currentTarget);
    let prompt = formData.get("prompt");
    if (typeof prompt !== "string") {
      return;
    }
    let newMessages = [...messages, { role: "user", content: prompt }];

    console.log("Modify Code (mode:", modelUsedForInitialCode, ")");
    console.dir(newMessages);

    setGeneratedCode("");
    const chatRes = await fetch("/api/generateCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: newMessages,
        mode: modelUsedForInitialCode,
      }),
    });
    console.log("request end");

    if (!chatRes.ok) {
      throw new Error(chatRes.statusText);
    }

    // This data is a ReadableStream
    const data = chatRes.body;
    if (!data) {
      return;
    }

    if (prompt.toLowerCase().includes("llama")) {
      setIsConfettiActive(true);
    }

    let localGeneratedCode = ""; // For local access
    const onParse = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event") {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? "";
          localGeneratedCode += text; // update locally
          setGeneratedCode((prev) => prev + text); // update react state
        } catch (e) {
          console.error(e);
        }
      }
    };

    // https://web.dev/streams/#the-getreader-and-read-methods
    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParse);
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }

    newMessages = [
      ...newMessages,
      { role: "assistant", content: localGeneratedCode },
    ];

    setMessages(newMessages);
    setStatus("updated");

    console.log("Message Thread (mode:", modelUsedForInitialCode, ")");
    console.dir(newMessages);
  }

  async function animateScene() {
    setStatus("updating");

    // Now we switch to animation mode, which further gets used when editing the generated code
    setModelUsedForInitialCode("animate");

    // let formData = new FormData(e.currentTarget);
    // let prompt = formData.get("prompt");
    // if (typeof prompt !== "string") {
    //   return;
    // }

    const objectToAnimate = messages[0].content; // The first user message is the object to animate
    let newMessages = [
      {
        role: "user",
        content: `animate the "${objectToAnimate}"\n${generatedCode}`,
      },
    ];

    console.log("Animate Code (mode:", "animate", ")");
    console.dir(newMessages);

    setGeneratedCode("");
    const chatRes = await fetch("/api/generateCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: newMessages,
        mode: "animate", // this switches to animation mode
      }),
    });
    console.log("request end");

    if (!chatRes.ok) {
      throw new Error(chatRes.statusText);
    }

    // This data is a ReadableStream
    const data = chatRes.body;
    if (!data) {
      return;
    }
    const onParse = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event") {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? "";
          setGeneratedCode((prev) => prev + text);
        } catch (e) {
          console.error(e);
        }
      }
    };

    // https://web.dev/streams/#the-getreader-and-read-methods
    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParse);
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }

    newMessages = [
      ...newMessages,
      { role: "assistant", content: generatedCode },
    ];

    setMessages(newMessages);
    setStatus("updated");

    console.log("Message Thread (mode:", "animate", ")");
    console.dir(newMessages);
  }

  useEffect(() => {
    let el = document.querySelector(".cm-scroller");
    if (el && loading) {
      let end = el.scrollHeight - el.clientHeight;
      el.scrollTo({ top: end });
    }
  }, [loading, generatedCode]);

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center py-2">
      <div className="fixed left-0 top-0">
        {isClient && (
          <Confetti
            width={dimensions.width}
            height={dimensions.height}
            numberOfPieces={isConfettiActive ? 500 : 0}
            gravity={0.6}
            initialVelocityY={8}
            opacity={85}
            recycle={false}
            onConfettiComplete={(confetti) => {
              console.log("confetti complete");
              setIsConfettiActive(false);
              confetti?.reset();
            }}
          />
        )}
      </div>
      {inAnimationMode && (
        <div className="fixed left-0 top-0 z-50 h-5 w-full overflow-hidden bg-yellow-400">
          <div
            className="absolute inset-0 flex"
            style={{ transform: "skew(-45deg)" }}
          >
            {[...Array(40)].map((_, index) => (
              <div
                key={index}
                className="h-full w-5 bg-black"
                style={{ marginRight: "20px" }}
              />
            ))}
          </div>
        </div>
      )}

      <Header />

      <main className="mt-12 flex w-full flex-1 flex-col items-center px-4 text-center sm:mt-20">
        <h1 className="my-6 max-w-3xl text-4xl font-bold text-gray-800 sm:text-6xl">
          Turn your <span className="text-green-600">idea</span>
          <br /> into a <span className="text-green-600">scene</span>
        </h1>

        <form className="w-full max-w-xl" onSubmit={generateCode}>
          <fieldset disabled={loading} className="disabled:opacity-75">
            <div className="relative mt-12">
              <div className="absolute -inset-2 rounded-[32px] bg-gray-300/50" />
              <div className="relative flex rounded-3xl bg-white shadow-sm">
                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                  <input
                    name="prompt"
                    className="w-full rounded-l-3xl bg-transparent px-6 py-5 text-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500"
                    placeholder="An 8-bit llama in a desert"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-3xl px-3 py-2 text-sm font-semibold text-green-500 hover:text-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500 disabled:text-gray-900"
                >
                  {status === "creating" ? (
                    <LoadingDots color="black" style="large" />
                  ) : (
                    <ArrowLongRightIcon className="-ml-0.5 size-6" />
                  )}
                </button>
              </div>
            </div>
            <div className="mt-12 flex items-center justify-center gap-3">
              <p className="text-xs text-gray-500">Mode:</p>
              <Select.Root name="model" defaultValue="svg" disabled={loading}>
                <Select.Trigger className="group flex w-full max-w-xs items-center rounded-2xl border-[6px] border-gray-300 bg-white px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500">
                  <Select.Value />
                  <Select.Icon className="ml-auto">
                    <ChevronDownIcon className="size-6 text-gray-300 group-focus-visible:text-gray-500 group-enabled:group-hover:text-gray-500" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden rounded-md bg-white shadow-lg">
                    <Select.Viewport className="p-2">
                      {[
                        {
                          label: "SVG Only",
                          value: "svg",
                        },
                        {
                          label: "Full HTML",
                          value: "html",
                        },
                      ].map((model) => (
                        <Select.Item
                          key={model.value}
                          value={model.value}
                          className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm data-[highlighted]:bg-gray-100 data-[highlighted]:outline-none"
                        >
                          <Select.ItemText asChild>
                            <span className="inline-flex items-center gap-2 text-gray-500">
                              <div className="size-2 rounded-full bg-green-500" />
                              {model.label}
                            </span>
                          </Select.ItemText>
                          <Select.ItemIndicator className="ml-auto">
                            <CheckIcon className="size-5 text-green-600" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton />
                    <Select.Arrow />
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </fieldset>
        </form>

        <hr className="border-1 mb-20 h-px bg-gray-700 dark:bg-gray-700" />

        {status !== "initial" && (
          <motion.div
            initial={{ height: 0 }}
            animate={{
              height: "auto",
              overflow: "hidden",
              transitionEnd: { overflow: "visible" },
            }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="w-full pb-[25vh] pt-10"
            onAnimationComplete={() => scrollTo()}
            ref={ref}
          >
            <div className="mt-5 flex gap-4">
              <form className="w-full" onSubmit={modifyCode}>
                <fieldset disabled={loading} className="group">
                  <div className="relative">
                    <div className="relative flex rounded-3xl border-8 border-gray-200 bg-white shadow-sm group-disabled:bg-gray-50">
                      <div className="relative flex flex-grow items-stretch focus-within:z-10">
                        <input
                          required
                          name="prompt"
                          className="w-full rounded-l-3xl bg-transparent px-6 py-5 text-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500 disabled:cursor-not-allowed"
                          placeholder={`Make changes to your ${modelUsedForInitialCode === "animate" ? "animation" : "svg"} here`}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-3xl px-3 py-2 text-sm font-semibold text-green-500 hover:text-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500 disabled:text-gray-900"
                      >
                        {loading ? (
                          <LoadingDots color="black" style="large" />
                        ) : (
                          <ArrowLongRightIcon className="-ml-0.5 size-6" />
                        )}
                      </button>
                    </div>
                  </div>
                </fieldset>
              </form>
              <div>
                <Tooltip.Provider>
                  <Tooltip.Root delayDuration={0}>
                    <Tooltip.Trigger asChild>
                      <button
                        disabled={modelUsedForInitialCode === "animate"}
                        onClick={animateScene}
                        className={`my-2 inline-flex size-[68px] items-center justify-center rounded-3xl ${modelUsedForInitialCode === "animate" ? "bg-gray-500" : "bg-green-500"}`}
                      >
                        <PlayIcon className="size-10 text-white" />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="select-none rounded bg-white px-4 py-2.5 text-sm leading-none shadow-md shadow-black/20"
                        sideOffset={5}
                      >
                        {modelUsedForInitialCode === "animate"
                          ? "Already animated!"
                          : "Animate it!"}
                        <Tooltip.Arrow className="fill-white" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
            </div>
            <div className="relative mt-8 w-full overflow-hidden">
              <div className="isolate">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative overflow-hidden rounded-3xl border border-gray-300">
                    <SyntaxHighlighter
                      customStyle={{
                        height: "600px",
                        width: "100%",
                        overflow: "auto",
                        borderRadius: "0rem",
                        fontSize: "1.125rem",
                        outline: "2px solid transparent",
                        outlineOffset: "2px",
                        margin: "0",
                        padding: "1rem",
                      }}
                      language="svg"
                      style={dracula}
                    >
                      {generatedCode}
                    </SyntaxHighlighter>
                    <div className="flex justify-end bg-gray-100 p-2">
                      <button
                        className="mr-1 size-6 justify-start text-gray-500 group-focus-visible:text-gray-500 group-enabled:group-hover:text-gray-500"
                        onClick={copyToClipboard}
                      >
                        {isCopied ? <CheckCircleIcon /> : <ClipboardIcon />}
                      </button>
                      <button
                        className="mr-1 size-6 justify-start text-gray-500 group-focus-visible:text-gray-500 group-enabled:group-hover:text-gray-500"
                        onClick={downloadGeneratedCode}
                      >
                        <ArrowDownOnSquareIcon />
                      </button>
                    </div>
                  </div>
                  <div
                    className="relative overflow-hidden rounded-3xl border border-gray-300 pt-2.5"
                    style={{ margin: "0", padding: "0" }}
                  >
                    <Artifact
                      loading={loading}
                      className="h-[600px] w-full bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500"
                      markup={generatedCode}
                      darkMode={isDarkMode}
                      refreshKey={refreshKey}
                    />
                    <div className="flex justify-end bg-gray-100 p-2">
                      <button
                        className="mr-1 size-6 justify-start text-gray-500 group-focus-visible:text-gray-500 group-enabled:group-hover:text-gray-500"
                        onClick={toggleDarkMode}
                      >
                        {isDarkMode ? <MoonIcon /> : <SunIcon />}
                      </button>
                      <button
                        className="mr-1 size-6 justify-start text-gray-500 group-focus-visible:text-gray-500 group-enabled:group-hover:text-gray-500"
                        onClick={handleRefresh}
                      >
                        <ArrowPathIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {/* {loading && (
                  <motion.div
                    initial={status === "updating" ? { x: "100%" } : undefined}
                    animate={status === "updating" ? { x: "0%" } : undefined}
                    exit={{ x: "100%" }}
                    transition={{
                      type: "spring",
                      bounce: 0,
                      duration: 0.85,
                      delay: 0.5,
                    }}
                    className="absolute inset-x-0 bottom-0 top-1/2 flex items-center justify-center rounded-r border border-gray-400 bg-gradient-to-br from-gray-100 to-gray-300 md:inset-y-0 md:left-1/2 md:right-0"
                  >
                    <p className="animate-pulse text-3xl font-bold">
                      {status === "creating"
                        ? "Building your app..."
                        : "Updating your app..."}
                    </p>
                  </motion.div>
                )} */}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </main>
      {/* <Footer /> */}
    </div>
  );
}
