let currentUser;

async function logout(e) {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:8080/api/auth/logout", {}).then();
    if (!res.ok) return console.log(res.error);
    location.replace("./login");
  } catch (error) {
    console.log(error.message);
  }
}
async function getData() {
  try {
    const tokenRes = await fetch("http://localhost:8080/api/auth/refresh");
    const token = (await tokenRes.json()).accessToken;
    let res;
    const query = new URLSearchParams(window.location.search);
    const searchQuery = query.get("search");
    if (searchQuery)
      res = await fetch(
        `http://localhost:8080/api/products/${location.search}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
    else
      res = await fetch("http://localhost:8080/api/products", {
        headers: { authorization: `Bearer ${token}` },
      });

    if (!res.ok)
      throw new Error((await res.json().message) || "Get data failed");

    const data = (await res.json()).data;
    const products = Object.entries(data[0]);

    products.forEach((catProduct) =>
      renderProducts(catProduct[0], catProduct[1])
    );
    AddCartFunc();
  } catch (error) {
    console.log(error.message);
  }
}

function renderProducts(cat, products) {
  const catHTML = `
    <h2 class="header">
    ${cat}
  </h2>
  `;
  let productHTML = "";

  products.forEach((product) => {
    const randomImageURL = `./img/image0${
      Math.floor(Math.random() * 9) + 1
    }.png`;

    productHTML += `
   <span class="product" id="${product.id}">
      <img
        src="${product.imageURL || randomImageURL}"
        alt="product image"
      />
      <span>
        <p>${product.name}</p>
        <button class="test">⌂ Add</button>
      </span>
    </span>
    `;
  });
  document.querySelector("main.main").insertAdjacentHTML(
    "beforeend",
    `
      <section class="section-category">
          ${catHTML}
        <div class="main">
      ${productHTML}
      </div>
      </section>;
    `
  );
}
function AddCartFunc() {
  const allProductEl = document.querySelectorAll(".product");
  allProductEl.forEach((productEl) =>
    productEl.querySelector("button").addEventListener("click", async (e) => {
      e.preventDefault();
      const tokenRes = await fetch("http://localhost:8080/api/auth/refresh");
      const token = (await tokenRes.json()).accessToken;

      await fetch(`http://localhost:8080/api/users/${currentUser.id}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: productEl.id,
        }),
      });
    })
  );
}
//--
//--
//--
//-- todo: GET USER DATA AND HANDLE AMDIN PAGE
//--
//--
//--
//--
async function getUser() {
  try {
    const tokenRes = await fetch("http://localhost:8080/api/auth/refresh");
    const token = (await tokenRes.json()).accessToken;
    console.log(token);

    const res = await fetch("http://localhost:8080/api/users/currentUser", {
      headers: { authorization: `Bearer ${token}` },
    });
    const curUser = (await res.json()).data;
    // handleToast({
    //   header: `Welcome Back,`,
    //   message: `
    //  ${currentUser.username
    //    .split(" ")
    //    .map((name) => `${name.slice(0, 1)}${name.slice(1)}`)
    //    .join(" ")} `,
    // });
    if (!res.ok || !curUser) return console.log("Problem fetching data --Dane");

    if (curUser.roles.includes("admin")) {
      const ulEl = document.querySelector("nav.nav ul");
      ulEl.insertAdjacentHTML(
        "afterbegin",
        `<li><a href="/admin" class="admin">Admin Page</a></li>`
      );
    }
    return curUser;
  } catch (error) {
    console.log(error.message);
  }
}
addEventListener("load", async () => {
  currentUser = await getUser();
  console.log(currentUser);
  await getData();
});
document.querySelector("#logout-link").addEventListener("click", logout);

document.querySelector("#searchReset").addEventListener("click", () => {
  if (location.search) location.replace("./");
});
