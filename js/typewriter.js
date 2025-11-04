function startTypewriter(message, textElementId = "typewriter-text", containerSelector = ".typewriter-container") {
  const textElement = document.getElementById(textElementId);
  const container = document.querySelector(containerSelector);
  const typingDelay = 70;
  let index = 0;
  let typingTimeout;

  if (!textElement || !container) {
    console.error("Typewriter: missing text element or container.");
    return;
  }

  function typeCharacter() {
    if (index <= message.length) {
      textElement.innerHTML = message.substring(0, index) + '<span class="cursor">|</span>';
      index++;
      typingTimeout = setTimeout(typeCharacter, typingDelay);
    }
  }

  function startTyping() {
    clearTimeout(typingTimeout);
    index = 0;
    textElement.innerHTML = "";
    typeCharacter();
  }

  setTimeout(startTyping, 500);
  container.addEventListener("click", startTyping);
}