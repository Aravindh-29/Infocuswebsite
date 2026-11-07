// Next.js 16.4's Windows export leaves backslashes in prefetch segment names.
// Add the flattened filenames requested by the client router. Linux exports
// already use these filenames, so this becomes a no-op there.
import { readdir, copyFile } from "node:fs/promises";
import { join, relative } from "node:path";
let count = 0;
async function copySegments(segmentRoot, current, parent, prefix) {
  for (const item of await readdir(current, { withFileTypes: true })) {
    const path = join(current, item.name);
    if (item.isDirectory())
      await copySegments(segmentRoot, path, parent, prefix);
    else if (item.name.endsWith(".txt")) {
      const filename =
        prefix + "." + relative(segmentRoot, path).replace(/[\\/]/g, ".");
      await copyFile(path, join(parent, filename));
      count++;
    }
  }
}
async function walk(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    if (!item.isDirectory()) continue;
    const path = join(dir, item.name);
    if (item.name.startsWith("__next."))
      await copySegments(path, path, dir, item.name);
    else if (item.name !== "_next") await walk(path);
  }
}
await walk("out");
console.log(
  `Static prefetch compatibility: ${count} segment files normalized.`,
);
