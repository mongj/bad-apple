type Frame = { src: string | undefined; isFetching: boolean };
type FrameBuffer = Record<number, Frame>;

let currentFrame: TextNode | undefined;

const font = { family: "Roboto Mono", style: "Medium" };

figma.on("close", () => {
  if (currentFrame) {
    currentFrame.remove();
  }
});

(async () => {
  await figma.loadFontAsync(font);

  const frameBuffer: FrameBuffer = {};
  let lastRenderedFrameIndex = 0;
  const totalFrames = 2500;
  const fetchBatchSize = 60;
  const bufferLowThreshold = 120;

  const fetchMoreFrames = async (index?: number, blocking = false) => {
    const lastFrameInBuffer = Math.max(...Object.keys(frameBuffer).map(Number));
    const startIndex = index ?? lastFrameInBuffer + 1;
    if (startIndex >= totalFrames) return;

    const framesToFetch = Math.min(fetchBatchSize, totalFrames - startIndex);
    // console.log(`  fetching more frames`);
    // console.log(
    //   `    startIndex: ${startIndex}, index: ${index}, lastFrameInBuffer: ${lastFrameInBuffer}`
    // );
    // console.log(`    framesToFetch: ${framesToFetch}`);
    // console.log(`    lastRenderedFrameIndex: ${lastRenderedFrameIndex}`);

    const promises: Promise<void>[] = [];
    for (let i = 0; i < framesToFetch; i++) {
      const fetchIndex = startIndex + i;
      if (
        frameBuffer[fetchIndex]?.isFetching ||
        fetchIndex <= lastRenderedFrameIndex
      )
        continue;
      try {
        frameBuffer[fetchIndex] = { src: undefined, isFetching: true };
        promises.push(
          fetch(`https://bad-apple.evan-zhangmingjun.workers.dev/${fetchIndex}`)
            .then((res) => res.text())
            .then((text) => {
              // console.log(`      fetched frame: ${fetchIndex}`);
              frameBuffer[fetchIndex] = { src: text, isFetching: false };
            })
        );
      } catch (e) {
        console.error(`      failed to fetch frame: ${startIndex + i}`);
        frameBuffer[startIndex + i] = { src: undefined, isFetching: false };
      }
    }
    if (blocking) {
      await Promise.all(promises);
    }
  };

  // Loop through and render each frame.
  for (let currentIndex = 1; currentIndex < totalFrames; currentIndex++) {
    // console.log("currentIndex", currentIndex, "buffer", frameBuffer);
    // If the buffer is running low and we're not already fetching, get more frames.
    if (Object.keys(frameBuffer).length < bufferLowThreshold) {
      fetchMoreFrames();
    }

    let attempts = 0;
    while (!frameBuffer[currentIndex] || !frameBuffer[currentIndex].src) {
      if (attempts > 10) {
        currentIndex++;
        attempts = 0;
        continue;
      }
      if (frameBuffer[currentIndex]?.isFetching) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        attempts++;
        continue;
      }
      // console.log("  blocking fetch", currentIndex);
      await fetchMoreFrames(currentIndex, true);
      // console.log("  after blocking fetch", currentIndex);
      await new Promise((resolve) => setTimeout(resolve, 500));
      attempts++;
    }

    const text = frameBuffer[currentIndex].src!;
    const textNode = figma.createText();
    textNode.fontName = font;
    textNode.characters = text;
    // console.log(
    //   `  rendered frame: ${currentIndex}, buffer size: ${
    //     Object.keys(frameBuffer).length
    //   }`
    // );

    if (currentFrame) {
      currentFrame.remove();
    }
    currentFrame = textNode;

    lastRenderedFrameIndex = currentIndex;
    delete frameBuffer[currentIndex];

    await new Promise((resolve) => setTimeout(resolve, 33));
  }
  figma.closePlugin();
})();
