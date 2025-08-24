const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = form.username.value;
  const email = form.email.value;
  const password = form.password.value;
  const termsConditions = form["terms-conditions"].checked;

  try {
    const res = await fetch("http://localhost:8080/api/users/create", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        "terms-conditions": termsConditions,
      }),
    });
    const resData = await res.json();
    const user = await resData.data;
    const error = res.message || resData.message;
    if (!res.ok || error) return console.log(error);

    location.assign(`${location.origin}/`);

    console.log(user);
  } catch (err) {
    console.log(err);
  }
});
