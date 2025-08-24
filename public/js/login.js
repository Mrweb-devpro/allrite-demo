import { handleFormError } from "./utils.js";

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;

  try {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await res.json();
    const token = await data.accessToken;

    const error = res.message || data.message;
    if (!res.ok || error) return handleFormError(error);

    location.assign(`${location.origin}/`);
    console.log(token);
  } catch (err) {
    handleFormError(err.message);
  }
});
