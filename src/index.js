const charsLowerCase = "abcdefghijklmnopqrstuvwxyz";
const charsUpperCase = charsLowerCase.toUpperCase();
const specChars = "!@#$%&;?-+=~,^'_()[]{}";
const numbers = "1234567890";

const $$ = _ => document.querySelectorAll(_);
const $ = _ => document.querySelector(_);

const copyButton = $("#pass-generator__copy-button");
const copyTooltip = $(".pass-generator__copy-button-tooltip");
const passLenghtSpan = $("#pass-generator__length");
const passLenghtSlider = $("#pass-generator__slider");
const passLenghtDecButton = $(".pass-generator__slider-minus");
const passLenghtIncButton = $(".pass-generator__slider-plus");
const regeneratePassButton = $("#regenerate-password");
const passComplexityBadge = $("#password-badge");
const passResult = $("#password");
const charsCheckboxes = $$(".pass-generator__chars-used input");

const dataCharTypes = {
  0: charsUpperCase,
  1: charsLowerCase,
  2: numbers,
  3: specChars,
};

const state = {
  minValue: 1,
  maxValue: 50,
  passLenght: 15,
  allowChars: charsUpperCase + charsLowerCase + numbers,
  selectedCharTypes: [0, 1, 2],
};

// first init
onChangePasswordLenght(state.passLenght);
onChangeCharCheckbox(state.selectedCharTypes);
charsCheckboxes.forEach((x, i) => {
  x.checked = state.selectedCharTypes.includes(i);
});

copyButton.addEventListener("click", () => {
  copyTooltip.style.display = "block";
  navigator.clipboard.writeText(passResult.textContent).then(showTooltip);
});

passLenghtSlider.addEventListener("input", e =>
  onChangePasswordLenght(e.target.value)
);

passLenghtDecButton.addEventListener("click", () => {
  if (state.passLenght - 1 < state.minValue) return;
  state.passLenght -= 1;
  onChangePasswordLenght(state.passLenght);
});

passLenghtIncButton.addEventListener("click", () => {
  if (state.passLenght + 1 > state.maxValue) return;
  state.passLenght += 1;
  onChangePasswordLenght(state.passLenght);
});

regeneratePassButton.addEventListener("click", () => {
  onChangePasswordLenght(state.passLenght);
  regeneratePassButton.classList.add("rotate");
  setTimeout(() => {
    regeneratePassButton.classList.remove("rotate");
  }, 750);
});

charsCheckboxes.forEach(x =>
  x.addEventListener("change", e => {
    const { charType } = e.target.dataset;
    const { checked } = e.target;

    if (!checked && state.selectedCharTypes.length <= 1) {
      x.checked = true;
      return;
    }

    onChangeCharCheckbox(
      checked
        ? [...state.selectedCharTypes, Number(charType)]
        : state.selectedCharTypes.filter(x => x != charType)
    );
  })
);

var showTooltip = (() => {
  let timoutId = null;
  return () => {
    if (timoutId) clearTimeout(timoutId);
    copyTooltip.classList.add("copy-tooltip-visible");

    timoutId = setTimeout(
      () => copyTooltip.classList.remove("copy-tooltip-visible"),
      1250
    );
  };
})();

function onChangeCharCheckbox(inputCharTypes) {
  if (!inputCharTypes.length) return;

  state.selectedCharTypes = inputCharTypes;
  state.allowChars = inputCharTypes.map(x => dataCharTypes[Number(x)]).join("");
  passResult.textContent = getRandomPassword(
    state.allowChars,
    state.passLenght
  );
}

function onChangePasswordLenght(newValue) {
  state.passLenght = Number(newValue);
  passLenghtSpan.textContent = newValue;
  passLenghtSlider.value = newValue;
  passResult.textContent = getRandomPassword(state.allowChars, newValue);

  // Change badge
  const complexity = getPasswordComplexity(newValue);
  passComplexityBadge.textContent = complexity;
  passComplexityBadge.classList.remove("strong", "good", "weak");
  passComplexityBadge.classList.add(complexity.replace("very ", ""));
}

function getRandomPassword(inputString, length) {
  const pass = [];
  const shuffledString = shuffle(inputString.split("")).join("");

  for (let index = 0; index < length; index++) {
    pass[index] = shuffledString[getRandomInt(inputString.length)];
  }

  return pass.join("");
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function getPasswordComplexity(length) {
  if (length >= 12) return "very strong";
  if (length >= 10) return "strong";
  if (length >= 8) return "good";
  if (length >= 5) return "weak";
  return "very weak";
}
