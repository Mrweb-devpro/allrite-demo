import { handleFormError } from "./utils.js";

const form = document.querySelector("form");

const imageProp = {};
let reader;

const imageInputEl = form.querySelector('input[type="file"]');

imageInputEl.addEventListener("change", (e) => {
  imageProp.files = e.target.files;
  imageProp.name = e.target.value;
  reader = new FileReader();

  reader.onload = function () {
    imageProp.url = reader.result;
  };
  reader.readAsDataURL(imageProp.files[0]);
});

handleFormError.clearError();
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = form.name.value;
  const price = form.price.value;
  const quantity = form.quantity.value;
  const description = form.description.value;
  const category = form.category.value;
  const { url: imageURL } = imageProp;
  console.log(imageURL);

  try {
    const tokenRes = await fetch("http://localhost:8080/api/auth/refresh");
    const token = (await tokenRes.json()).accessToken;

    const res = await fetch("http://localhost:8080/api/products/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        price,
        description,
        imageURL,
        quantity,
        category,
      }),
    });

    console.log(res.status);
    const resData = await res.json();

    if (!res.ok || !resData.success) {
      return handleFormError(resData?.message);
    }
    form.reset();
    handleFormError.clearError();
  } catch (error) {
    handleFormError(error.message);
  }
});
