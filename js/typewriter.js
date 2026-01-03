function startTypewriter(message, textElementId = "typewriter-text", containerSelector = ".typewriter-container") {
  const textElement = document.getElementById(textElementId);
  let container = document.querySelector(containerSelector);
  const typingDelay = 70;
  let index = 0;
  let typingTimeout;

  if (!textElement) {
    console.error("Typewriter: missing text element.");
    return;
  }

  // If the configured container isn't found, fall back to the text element's parent
  if (!container) {
    container = textElement.parentElement;
  }

  if (!container) {
    console.error("Typewriter: missing container for height reservation and click handling.");
    return;
  }

  function reserveContainerHeight() {
    const computed = getComputedStyle(textElement);
    const clone = textElement.cloneNode(false);
    clone.style.position = 'absolute';
    clone.style.visibility = 'hidden';
    clone.style.pointerEvents = 'none';
    clone.style.whiteSpace = 'pre-wrap';
    clone.style.fontFamily = computed.fontFamily;
    clone.style.fontSize = computed.fontSize;
    clone.style.lineHeight = computed.lineHeight;
    clone.style.boxSizing = computed.boxSizing;
    clone.style.padding = computed.padding;

    // Use the actual rendered width of the text element so wrapping matches exactly
    const targetWidth = Math.max(textElement.getBoundingClientRect().width, textElement.clientWidth, container.clientWidth);
    clone.style.width = targetWidth + 'px';
    clone.textContent = message;
    container.appendChild(clone);
    const needed = Math.ceil(clone.getBoundingClientRect().height);
    // Set the paragraph (textElement) min-height so it starts with full space and won't grow
    textElement.style.minHeight = needed + 'px';
    container.style.minHeight = Math.max(container.getBoundingClientRect().height, needed + parseFloat(computed.paddingTop || 0) + parseFloat(computed.paddingBottom || 0)) + 'px';
    container.removeChild(clone);
  }

  function ensureCursor() {
    let cursor = textElement.querySelector('.cursor');
    if (!cursor) {
      cursor = document.createElement('span');
      cursor.className = 'cursor';
      cursor.textContent = '|';
      textElement.appendChild(cursor);
    }
    return cursor;
  }

  function typeCharacter() {
    if (index <= message.length) {
      const visible = message.substring(0, index);
      textElement.textContent = visible;
      ensureCursor();
      index++;
      typingTimeout = setTimeout(typeCharacter, typingDelay);
    }
  }

  function startTyping() {
    clearTimeout(typingTimeout);
    index = 0;
    textElement.textContent = "";
    reserveContainerHeight();
    typeCharacter();
  }

  setTimeout(startTyping, 500);
  container.addEventListener("click", () => {
    reserveContainerHeight();
    startTyping();
  });
}