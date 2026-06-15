const STORAGE_KEY = "kaz_reservas";

const ITEMS_PER_PAGE = 10;

let reservas =
  JSON.parse(
    localStorage.getItem(STORAGE_KEY)
  ) || [];

let currentPage = 1;

let selectedReserva = null;

/*
==================================
ELEMENTOS
==================================
*/

const reservasList =
  document.getElementById(
    "reservasList"
  );

const totalReservas =
  document.getElementById(
    "totalReservas"
  );

const totalPendientes =
  document.getElementById(
    "totalPendientes"
  );

const statusFilter =
  document.getElementById(
    "statusFilter"
  );

const btnMore =
  document.getElementById(
    "btnMore"
  );

const btnOpenModal =
  document.getElementById(
    "btnOpenModal"
  );

const reservationModal =
  document.getElementById(
    "reservationModal"
  );

const detailsModal =
  document.getElementById(
    "detailsModal"
  );

const btnCancel =
  document.getElementById(
    "btnCancel"
  );

const btnSave =
  document.getElementById(
    "btnSave"
  );

const btnCloseDetails =
  document.getElementById(
    "btnCloseDetails"
  );

const clienteInput =
  document.getElementById(
    "clienteInput"
  );

const tituloInput =
  document.getElementById(
    "tituloInput"
  );

const descripcionInput =
  document.getElementById(
    "descripcionInput"
  );

const precioInput =
  document.getElementById(
    "precioInput"
  );

const recibidoInput =
  document.getElementById(
    "recibidoInput"
  );

const fechaInput =
  document.getElementById(
    "fechaInput"
  );

const formError =
  document.getElementById(
    "formError"
  );

const detailsContent =
  document.getElementById(
    "detailsContent"
  );

const statusActions =
  document.getElementById(
    "statusActions"
  );

const pendingAmount =
  document.getElementById(
    "pendingAmount"
  );

const abonoInput =
  document.getElementById(
    "abonoInput"
  );

const abonoError =
  document.getElementById(
    "abonoError"
  );

const btnAddAbono =
  document.getElementById(
    "btnAddAbono"
  );

/*
==================================
UTILS
==================================
*/

function saveData() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(reservas)
  );

}

function getPendiente(reserva) {

  return Math.max(
    0,
    reserva.precio -
    reserva.recibido
  );

}

function daysUntil(dateString) {

  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  const target =
    new Date(dateString);

  target.setHours(
    0,
    0,
    0,
    0
  );

  const diff =
    target - today;

  return Math.floor(
    diff /
    (1000 * 60 * 60 * 24)
  );

}

/*
==================================
VALIDACION FORM
==================================
*/

function validateForm() {

  const cliente =
    clienteInput.value.trim();

  const titulo =
    tituloInput.value.trim();

  const precio =
    parseFloat(
      precioInput.value
    );

  const recibido =
    parseFloat(
      recibidoInput.value || 0
    );

  const fecha =
    fechaInput.value;

  formError.textContent =
    "";

  if (
    !cliente ||
    !titulo ||
    !precio ||
    !fecha
  ) {

    btnSave.disabled =
      true;

    return;
  }

  if (
    recibido > precio
  ) {

    formError.textContent =
      "El recibido no puede ser mayor al precio";

    btnSave.disabled =
      true;

    return;
  }

  btnSave.disabled =
    false;

}

[
  clienteInput,
  tituloInput,
  descripcionInput,
  precioInput,
  recibidoInput,
  fechaInput
].forEach(el => {

  el.addEventListener(
    "input",
    validateForm
  );

});

/*
==================================
MODAL NUEVA RESERVA
==================================
*/

btnOpenModal.onclick =
  () => {

    reservationModal.classList.add(
      "active"
    );

  };

btnCancel.onclick =
  () => {

    reservationModal.classList.remove(
      "active"
    );

  };

btnSave.onclick =
  () => {

    reservas.push({

      id: Date.now(),

      cliente:
        clienteInput.value.trim(),

      titulo:
        tituloInput.value.trim(),

      descripcion:
        descripcionInput.value.trim(),

      precio:
        Number(
          precioInput.value
        ),

      recibido:
        Number(
          recibidoInput.value || 0
        ),

      fechaEntrega:
        fechaInput.value,

      status:
        "En proceso",

      createdAt:
        new Date()
          .toISOString()
          .split("T")[0]

    });

    saveData();

    reservationModal.classList.remove(
      "active"
    );

    clienteInput.value = "";
    tituloInput.value = "";
    descripcionInput.value = "";
    precioInput.value = "";
    recibidoInput.value = "";
    fechaInput.value = "";

    render();

  };

/*
==================================
DETALLE
==================================
*/

function openDetails(id) {

  selectedReserva =
    reservas.find(
      r => r.id === id
    );

  if(!selectedReserva){
    return;
  }

  const pendiente =
    getPendiente(
      selectedReserva
    );

const abonoSection =
  document.getElementById(
    "abonoSection"
  );

  if(abonoSection){

  if(
    pendiente === 0 ||
    selectedReserva.status ===
    "Entregado"
  ){

    abonoSection.style.display =
      "none";

  }else{

    abonoSection.style.display =
      "block";

  }

}

  detailsContent.innerHTML =
    `
    <p>
      <strong>Cliente:</strong>
      ${selectedReserva.cliente}
    </p>

    <p>
      <strong>Título:</strong>
      ${selectedReserva.titulo}
    </p>

    <p>
      <strong>Descripción:</strong><br>
      ${
        selectedReserva.descripcion
        || "Sin descripción"
      }
    </p>

    <p>
      <strong>Precio:</strong>
      $${selectedReserva.precio.toFixed(2)}
    </p>

    <p>
      <strong>Recibido:</strong>
      $${selectedReserva.recibido.toFixed(2)}
    </p>

    <p>
      <strong>Pendiente:</strong>
      $${pendiente.toFixed(2)}
    </p>

    <p>
      <strong>Fecha compromiso:</strong>
      ${selectedReserva.fechaEntrega}
    </p>

    <p>
      <strong>Estado:</strong>
      ${selectedReserva.status}
    </p>
    `;

  if(pendiente > 0){

    pendingAmount.textContent =
      `Pendiente por liquidar: $${pendiente.toFixed(2)}`;

  }else{

    pendingAmount.textContent =
      "✅ Reserva liquidada";

  }

  /*
  ==========================
  LIMPIAR FORMULARIO ABONO
  ==========================
  */

  abonoInput.value = "";

  abonoError.textContent = "";

  /*
  ==========================
  BOTONES DE ESTADO
  ==========================
  */

  renderStatusActions();

  /*
  ==========================
  MOSTRAR / OCULTAR ABONOS
  ==========================
  */

  if(

    pendiente === 0 ||

    selectedReserva.status ===
    "Entregado"

  ){

    abonoSection.style.display =
      "none";

  }else{

    abonoSection.style.display =
      "block";

  }

  /*
  ==========================
  ABRIR MODAL
  ==========================
  */

  detailsModal.classList.add(
    "active"
  );

}

window.openDetails =
  openDetails;

btnCloseDetails.onclick =
  () => {

    detailsModal.classList.remove(
      "active"
    );

  };

/*
==================================
STATUS
==================================
*/

function renderStatusActions() {

  statusActions.innerHTML =
    "";

  const pendiente =
    getPendiente(
      selectedReserva
    );

  const status =
    selectedReserva.status;

  const createButton =
    (text, next) => {

      const btn =
        document.createElement(
          "button"
        );

      btn.className =
        "primary-btn";

      btn.textContent =
        text;

      btn.onclick =
        () => {

          selectedReserva.status =
            next;

          saveData();

          openDetails(
            selectedReserva.id
          );

          render();

        };

      statusActions.appendChild(
        btn
      );

    };

  if (
    status ===
    "En proceso"
  ) {

    createButton(
      "Marcar Completado",
      "Completado"
    );

  }

  if (
    status ===
      "Completado" &&
    pendiente === 0
  ) {

    createButton(
      "Marcar Enviado",
      "Enviado"
    );

  }

  if (
    status ===
      "Enviado" &&
    pendiente === 0
  ) {

    createButton(
      "Marcar Entregado",
      "Entregado"
    );

  }

}

/*
==================================
ABONOS
==================================
*/

btnAddAbono.onclick =
  () => {

    const cantidad =
      Number(
        abonoInput.value
      );

    if (
      !cantidad ||
      cantidad <= 0
    ) {

      return;
    }

    const pendiente =
      getPendiente(
        selectedReserva
      );

    if (
      cantidad >
      pendiente
    ) {

      abonoError.textContent =
        "Supera el pendiente";

      return;
    }

    selectedReserva.recibido +=
      cantidad;

    saveData();

    abonoInput.value = "";

    abonoError.textContent =
      "";

    openDetails(
      selectedReserva.id
    );

    render();

  };

/*
==================================
RENDER
==================================
*/

function render() {

  let filtered =
    [...reservas];

  if (
    statusFilter.value !==
    "Todos"
  ) {

    filtered =
      filtered.filter(
        r =>
          r.status ===
          statusFilter.value
      );

  }

  totalReservas.textContent =
    reservas.length;

  totalPendientes.textContent =
    reservas.filter(
      r =>
        getPendiente(r) > 0
    ).length;

  reservasList.innerHTML =
    "";

  const visible =
    filtered.slice(
      0,
      currentPage *
        ITEMS_PER_PAGE
    );

  visible.forEach(
    reserva => {

      const pendiente =
        getPendiente(
          reserva
        );

      const days =
        daysUntil(
          reserva.fechaEntrega
        );

      let alertHTML = "";

      if (
        days <= 2 &&
        days >= 0 &&
        reserva.status ===
          "En proceso"
      ) {

        alertHTML =
          `
          <span class="deadline-alert">
            ⚠
          </span>
          `;
      }

      if (
        days < 0 &&
        reserva.status !==
          "Entregado"
      ) {

        alertHTML =
          `
          <span class="deadline-overdue">
            ⚠
          </span>
          `;
      }

      reservasList.innerHTML +=
        `
        <div
          class="reserva-card"
          onclick="openDetails(${reserva.id})"
        >

          <div class="reserva-header">

            <h3>
              ${reserva.titulo}
            </h3>

            ${alertHTML}

          </div>

          <div>
            ${reserva.cliente}
          </div>

          <div>
            $${reserva.precio}
            /
            $${reserva.recibido}
          </div>

          ${
            pendiente > 0
            ? `
            <div class="pending-badge">
              Faltan $${pendiente}
            </div>
            `
            : ""
          }

          <div class="status-badge">
            ${reserva.status}
          </div>

        </div>
        `;
    }
  );

  btnMore.style.display =
    visible.length <
    filtered.length
      ? "block"
      : "none";

}

statusFilter.addEventListener(
  "change",
  () => {

    currentPage = 1;

    render();

  }
);

btnMore.onclick =
  () => {

    currentPage++;

    render();

  };

render();
