// hooks/useCopyToClipboard.js

import { useState, useEffect } from "react";

function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2500);
    }
  }, [isCopied]);

  async function copyToClipboard(text) {
    if (!navigator.clipboard) {
      // Clipboard API not supported
      try {
        // Fallback for older browsers (like Firefox before v49)
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.setAttribute("value", window.location.href);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        setIsCopied(true);
      } catch (err) {
        console.error("Failed to copy text: ", err);
        setIsCopied(false);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
      } catch (err) {
        console.error("Failed to copy text: ", err);
        setIsCopied(false);
      }
    }
  }

  return [isCopied, copyToClipboard];
}

export default useCopyToClipboard;
