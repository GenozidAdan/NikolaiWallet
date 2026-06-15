const STORAGE_KEY = "kaz_movimientos";

let movimientos =
  JSON.parse(
    localStorage.getItem(STORAGE_KEY)
  ) || [];

let showingAll = false;

/*
====================================
ELEMENTOS
====================================
*/

const totalElement =
  document.getElementById("total");

const digitalBalanceElement =
  document.getElementById(
    "digitalBalance"
  );

const physicalBalanceElement =
  document.getElementById(
    "physicalBalance"
  );

const monthIndicator =
  document.getElementById(
    "monthIndicator"
  );

const monthFilter =
  document.getElementById(
    "monthFilter"
  );

const movementsElement =
  document.getElementById(
    "movements"
  );

const btnMore =
  document.getElementById(
    "btnMore"
  );

const exportData =
  document.getElementById(
    "exportData"
  );

const btnOpenModal =
  document.getElementById(
    "btnOpenModal"
  );

const modal =
  document.getElementById(
    "movementModal"
  );

const btnCancel =
  document.getElementById(
    "btnCancel"
  );

const btnAdd =
  document.getElementById(
    "btnAdd"
  );

const amountInput =
  document.getElementById(
    "amountInput"
  );

const availableBalance =
  document.getElementById(
    "availableBalance"
  );

const errorMessage =
  document.getElementById(
    "errorMessage"
  );

const descriptionInput =
  document.getElementById(
    "descriptionInput"
  );

const toggleDescription =
  document.getElementById(
    "toggleDescription"
  );

/*
====================================
MES ACTUAL
====================================
*/

const currentMonth =
  new Date().toLocaleString(
    "es-MX",
    {
      month: "long"
    }
  );

monthIndicator.textContent =
  currentMonth.charAt(0)
    .toUpperCase() +
  currentMonth.slice(1);

/*
====================================
LOCAL STORAGE
====================================
*/

function saveMovements() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(movimientos)
  );

}

/*
====================================
SALDOS
====================================
*/

function getBalances() {

  let digital = 0;
  let fisico = 0;

  movimientos.forEach(mov => {

    if (
      mov.tipo === "digital"
    ) {

      digital += mov.cantidad;

    } else {

      fisico += mov.cantidad;

    }

  });

  return {

    digital,

    fisico,

    total:
      digital + fisico

  };

}

/*
====================================
TOTAL
====================================
*/

function renderTotal() {

  const balances =
    getBalances();

  totalElement.textContent =
    `$${balances.total.toFixed(2)}`;

  digitalBalanceElement.textContent =
    `$${balances.digital.toFixed(2)}`;

  physicalBalanceElement.textContent =
    `$${balances.fisico.toFixed(2)}`;

}

/*
====================================
FILTROS
====================================
*/

function renderFilters() {

  const meses = [

    ...new Set(
      movimientos.map(
        m => m.mes
      )
    )

  ];

  const current =
    monthFilter.value;

  monthFilter.innerHTML =
    `
      <option value="Todos">
        Todos los meses
      </option>
    `;

  meses.forEach(mes => {

    monthFilter.innerHTML +=
      `
      <option value="${mes}">
        ${mes}
      </option>
      `;

  });

  if (
    meses.includes(current)
  ) {

    monthFilter.value =
      current;

  }

}

/*
====================================
MOVIMIENTOS
====================================
*/

function renderMovements() {

  let filtered =
    [...movimientos].reverse();

  if (
    monthFilter.value !==
    "Todos"
  ) {

    filtered =
      filtered.filter(
        mov =>
          mov.mes ===
          monthFilter.value
      );

  }

  movementsElement.innerHTML =
    "";

  if (
    filtered.length === 0
  ) {

    movementsElement.innerHTML =
      `
      <div class="empty">
        No hay movimientos registrados
      </div>
      `;

    btnMore.style.display =
      "none";

    return;

  }

  const visible =
    showingAll
      ? filtered
      : filtered.slice(0, 8);

  visible.forEach(mov => {

    const isIncome =
      mov.cantidad >= 0;

    const div =
      document.createElement(
        "div"
      );

    div.className =
      "movement";

    div.innerHTML =
      `
      <div class="movement-info">

        <div class="movement-description">
          ${
            mov.descripcion
              ? mov.descripcion
              : "Sin descripción"
          }
        </div>

        <div class="movement-type">
          ${
            mov.tipo === "digital"
              ? "Digital"
              : "Físico"
          }
        </div>

        <div class="movement-date">
          ${mov.fecha}
        </div>

      </div>

      <div class="movement-right">

        <div class="${
          isIncome
            ? "income-value"
            : "expense-value"
        }">

          ${
            isIncome
              ? "+"
              : "-"
          }

          $${Math.abs(
            mov.cantidad
          ).toFixed(2)}

        </div>

        <button
          class="delete-btn"
          onclick="deleteMovement(${mov.id})"
        >
          Eliminar
        </button>

      </div>
      `;

    movementsElement.appendChild(
      div
    );

  });

  if (
    filtered.length <= 8
  ) {

    btnMore.style.display =
      "none";

  } else {

    btnMore.style.display =
      "block";

    btnMore.textContent =
      showingAll
        ? "Ver menos"
        : "Ver más";

  }

}

/*
====================================
MODAL
====================================
*/

btnOpenModal.addEventListener(
  "click",
  () => {

    modal.classList.add(
      "active"
    );

    validateMovement();

  }
);

btnCancel.addEventListener(
  "click",
  () => {

    closeModal();

  }
);

function closeModal() {

  modal.classList.remove(
    "active"
  );

  amountInput.value = "";

  descriptionInput.value =
    "";

  errorMessage.textContent =
    "";

  btnAdd.disabled = true;

}

/*
====================================
DESCRIPCION
====================================
*/

toggleDescription.addEventListener(
  "click",
  () => {

    descriptionInput
      .classList
      .toggle("show");

  }
);

/*
====================================
VALIDACION
====================================
*/

function validateMovement() {

  const value =
    amountInput.value.trim();

  const regex =
    /^-?\d+(\.\d+)?$/;

  const selectedType =
    document.querySelector(
      'input[name="walletType"]:checked'
    ).value;

  const balances =
    getBalances();

  const currentBalance =
    selectedType ===
    "digital"
      ? balances.digital
      : balances.fisico;

  availableBalance.textContent =
    `Saldo disponible: $${currentBalance.toFixed(2)}`;

  errorMessage.textContent =
    "";

  if (
    !regex.test(value)
  ) {

    btnAdd.disabled = true;

    return;

  }

  const amount =
    parseFloat(value);

  if (
    amount < 0 &&
    Math.abs(amount) >
      currentBalance
  ) {

    errorMessage.textContent =
      "No tienes dinero suficiente";

    btnAdd.disabled = true;

    return;

  }

  btnAdd.disabled = false;

}

amountInput.addEventListener(
  "input",
  validateMovement
);

document
  .querySelectorAll(
    'input[name="walletType"]'
  )
  .forEach(radio => {

    radio.addEventListener(
      "change",
      validateMovement
    );

  });

/*
====================================
AGREGAR
====================================
*/

btnAdd.addEventListener(
  "click",
  () => {

    const amountRaw =
      amountInput.value.trim();

    const regex =
      /^-?\d+(\.\d+)?$/;

    if (
      !regex.test(
        amountRaw
      )
    ) {

      return;

    }

    const cantidad =
      parseFloat(
        amountRaw
      );

    const type =
      document.querySelector(
        'input[name="walletType"]:checked'
      ).value;

    const mes =
      new Date()
        .toLocaleString(
          "es-MX",
          {
            month:
              "long"
          }
        );

    const mesCapitalized =
      mes.charAt(0)
        .toUpperCase() +
      mes.slice(1);

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    movimientos.push({

      id: Date.now(),

      cantidad,

      tipo: type,

      descripcion:
        descriptionInput.value
          .trim(),

      fecha: today,

      mes: mesCapitalized

    });

    saveMovements();

    renderAll();

    closeModal();

  }
);

/*
====================================
ELIMINAR
====================================
*/

function deleteMovement(id) {

  const confirmDelete =
    confirm(
      "¿Eliminar movimiento?"
    );

  if (
    !confirmDelete
  ) {

    return;

  }

  movimientos =
    movimientos.filter(
      mov =>
        mov.id !== id
    );

  saveMovements();

  renderAll();

}

window.deleteMovement =
  deleteMovement;

/*
====================================
VER MAS
====================================
*/

btnMore.addEventListener(
  "click",
  () => {

    showingAll =
      !showingAll;

    renderMovements();

  }
);

/*
====================================
FILTRO
====================================
*/

monthFilter.addEventListener(
  "change",
  () => {

    showingAll = false;

    renderMovements();

  }
);

/*
====================================
EXPORTAR JSON
====================================
*/

exportData.addEventListener(
  "click",
  () => {

    const dataStr =
      JSON.stringify(
        movimientos,
        null,
        2
      );

    const blob =
      new Blob(
        [dataStr],
        {
          type:
            "application/json"
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const a =
      document.createElement(
        "a"
      );

    a.href = url;

    a.download =
      "movimientos.json";

    a.click();

    URL.revokeObjectURL(
      url
    );

  }
);

/*
====================================
RENDER
====================================
*/

function renderAll() {

  renderTotal();

  renderFilters();

  renderMovements();

}

renderAll();
