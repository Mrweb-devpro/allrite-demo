export function handleFormError(errors) {
  const errorElement = document.querySelector("#form-error");

  console.log(errorElement);
  if ((typeof errors).toLowerCase() === "string")
    errorElement.innerHTML = `<p class="error">${errors}</p>`;
  else
    errors.forEach((error) => {
      errorElement.innerHTML += `<p class="error">${error}</p>`;
    });
}
handleFormError.clearError = function () {
  const errorElement = document.querySelector("#form-error");
  errorElement.innerHTML = "";
};

export function handleToast({ message, header, type, onStart }) {
  onStart();
  let timeOutID;
  let timeOutID2;
  const toastEl = document.createElement("div");
  toastEl.classList.add("toast");
  toastEl.classList.add("toastAnimate");
  if (header) toastEl.innerHTML += `<h4>${header}</h4>`;
  toastEl.innerHTML += `<p>${message}</p>`;
  toastEl.innerHTML += `<button>❌</button>`;

  const cancelBtn = toastEl.querySelector("button");

  if (type) toastEl.setAttribute("id", type);

  document.body.insertAdjacentElement("afterbegin", toastEl);
  console.log(toastEl);

  timeOutID = setTimeout(() => {
    document.body.querySelector(".toast").remove();
    clearTimeout(timeOutID);
  }, 5400);
  timeOutID2 = setTimeout(() => {
    toastEl.classList.remove("toastAnimate");
    clearTimeout(timeOutID2);
  }, 5000);

  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();

    clearTimeout(timeOutID);
    clearTimeout(timeOutID2);
    toastEl.classList.remove("toastAnimate");
    document.body.querySelector(".toast").remove();
  });
}
