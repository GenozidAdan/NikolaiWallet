const STORAGE_KEY =
  "kaz_deudas";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];

const currentMonth =
  MONTHS[
    new Date().getMonth()
  ];

let selectedMonth =
  currentMonth;

let selectedDebt =
  null;

/*
====================================
LOCAL STORAGE
====================================
*/

let deudas =
  JSON.parse(
    localStorage.getItem(
      STORAGE_KEY
    )
  ) || [];

function saveData(){

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      deudas
    )
  );

}

/*
====================================
ELEMENTOS
====================================
*/

const monthTotal =
  document.getElementById(
    "monthTotal"
  );

const monthPending =
  document.getElementById(
    "monthPending"
  );

const deudasList =
  document.getElementById(
    "deudasList"
  );

const monthChips =
  document.querySelectorAll(
    ".month-chip"
  );

const deudaModal =
  document.getElementById(
    "deudaModal"
  );

const detailsModal =
  document.getElementById(
    "detailsModal"
  );

const btnOpenModal =
  document.getElementById(
    "btnOpenModal"
  );

const btnCancel =
  document.getElementById(
    "btnCancel"
  );

const btnSave =
  document.getElementById(
    "btnSave"
  );

const entidadInput =
  document.getElementById(
    "entidadInput"
  );

const entidadSelector =
  document.getElementById(
    "entidadSelector"
  );

const mesInput =
  document.getElementById(
    "mesInput"
  );

const cantidadInput =
  document.getElementById(
    "cantidadInput"
  );

const apartadoInput =
  document.getElementById(
    "apartadoInput"
  );

const formError =
  document.getElementById(
    "formError"
  );

const entidadesExistentes =
  document.getElementById(
    "entidadesExistentes"
  );

/*
====================================
DETALLE
====================================
*/

const editEntidad =
  document.getElementById(
    "editEntidad"
  );

const editMes =
  document.getElementById(
    "editMes"
  );

const editCantidad =
  document.getElementById(
    "editCantidad"
  );

const editApartado =
  document.getElementById(
    "editApartado"
  );

const detailDate =
  document.getElementById(
    "detailDate"
  );

const detailsError =
  document.getElementById(
    "detailsError"
  );

const btnUpdateDebt =
  document.getElementById(
    "btnUpdateDebt"
  );

const btnDeleteDebt =
  document.getElementById(
    "btnDeleteDebt"
  );

const btnCloseDetails =
  document.getElementById(
    "btnCloseDetails"
  );

/*
====================================
ENTIDADES
====================================
*/

function renderEntities(){

  const entidades = [

    ...new Set(
      deudas.map(
        d => d.entidad
      )
    )

  ];

  entidadesExistentes.innerHTML =
    "";

  entidades.forEach(entidad => {

    const option =
      document.createElement(
        "option"
      );

    option.value =
      entidad;

    entidadesExistentes.appendChild(
      option
    );

  });

}

/*
====================================
MES ACTUAL
====================================
*/

function activateCurrentMonth(){

  monthChips.forEach(chip => {

    chip.classList.remove(
      "active"
    );

    if(
      chip.dataset.month ===
      currentMonth
    ){

      chip.classList.add(
        "active"
      );

      chip.scrollIntoView({

        behavior:
          "smooth",

        inline:
          "center"

      });

    }

  });

}

/*
====================================
MODAL NUEVA DEUDA
====================================
*/

btnOpenModal.addEventListener(
  "click",
  () => {

    entidadInput.value = "";

    entidadSelector.value = "";

    cantidadInput.value = "";

    apartadoInput.checked =
      false;

    formError.textContent =
      "";

    mesInput.value =
      selectedMonth;

    deudaModal.classList.add(
      "active"
    );

  }
);

btnCancel.addEventListener(
  "click",
  () => {

    deudaModal.classList.remove(
      "active"
    );

  }
);

/*
====================================
CREAR
====================================
*/

btnSave.addEventListener(
  "click",
  () => {

    const entidad =
      (
        entidadInput.value.trim()
        ||
        entidadSelector.value.trim()
      );

    const cantidad =
      parseFloat(
        cantidadInput.value
      );

    const mes =
      mesInput.value;

    if(!entidad){

      formError.textContent =
        "Selecciona una entidad.";

      return;

    }

    if(
      isNaN(cantidad)
      ||
      cantidad <= 0
    ){

      formError.textContent =
        "Cantidad inválida.";

      return;

    }

    const existingDebt =
      deudas.find(
        deuda =>

          deuda.entidad
            .toLowerCase() ===
          entidad
            .toLowerCase()

          &&

          deuda.mes === mes
      );

    if(existingDebt){

      const update =
        confirm(
          `Ya existe ${entidad} en ${mes}. ¿Actualizar monto?`
        );

      if(!update){
        return;
      }

      existingDebt.cantidad =
        cantidad;

      existingDebt.apartado =
        apartadoInput.checked;

      saveData();

      deudaModal.classList.remove(
        "active"
      );

      renderAll();

      return;

    }

    deudas.push({

      id:
        Date.now(),

      entidad,

      mes,

      cantidad,

      apartado:
        apartadoInput.checked,

      fechaCreacion:
        new Date()
          .toISOString()
          .split("T")[0]

    });

    saveData();

    deudaModal.classList.remove(
      "active"
    );

    renderAll();

  }
);

/*
====================================
RESUMEN
====================================
*/

function renderSummary(){

  const currentDebts =
    deudas.filter(
      d =>
        d.mes ===
        selectedMonth
    );

  const total =
    currentDebts.reduce(
      (acc,d) =>
        acc +
        d.cantidad,
      0
    );

  const pendiente =
    currentDebts
      .filter(
        d =>
          !d.apartado
      )
      .reduce(
        (acc,d) =>
          acc +
          d.cantidad,
        0
      );

  monthTotal.textContent =
    `$${total.toFixed(2)}`;

  monthPending.textContent =
    `$${pendiente.toFixed(2)}`;

}

/*
====================================
LISTADO
====================================
*/

function renderList(){

  const currentDebts =
    deudas.filter(
      d =>
        d.mes ===
        selectedMonth
    );

  deudasList.innerHTML =
    "";

  if(
    currentDebts.length === 0
  ){

    deudasList.innerHTML =
      `
      <div class="empty">
        No hay deudas registradas
      </div>
      `;

    return;

  }

  currentDebts
    .sort(
      (a,b) =>
        b.cantidad -
        a.cantidad
    )
    .forEach(deuda => {

      const card =
        document.createElement(
          "div"
        );

      card.className =
        "deuda-card";

      card.onclick =
        () =>
          openDetails(
            deuda.id
          );

      card.innerHTML =
        `
        <div class="deuda-top">

          <strong>
            ${deuda.entidad}
          </strong>

          <span class="${
            deuda.apartado
            ? "status-paid"
            : "status-pending"
          }">

            ${
              deuda.apartado
              ? "Apartado"
              : "Pendiente"
            }

          </span>

        </div>

        <div class="deuda-amount">

          $${deuda.cantidad.toFixed(2)}

        </div>
        `;

      deudasList.appendChild(
        card
      );

    });

}

/*
====================================
DETALLE
====================================
*/

function openDetails(id){

  selectedDebt =
    deudas.find(
      d =>
        d.id === id
    );

  if(!selectedDebt){
    return;
  }

  editEntidad.value =
    selectedDebt.entidad;

  editMes.value =
    selectedDebt.mes;

  editCantidad.value =
    selectedDebt.cantidad;

  editApartado.checked =
    selectedDebt.apartado;

  detailDate.textContent =
    `Registrada: ${selectedDebt.fechaCreacion}`;

  detailsError.textContent =
    "";

  detailsModal.classList.add(
    "active"
  );

}

/*
====================================
ACTUALIZAR
====================================
*/

btnUpdateDebt.addEventListener(
  "click",
  () => {

    const entidad =
      editEntidad.value.trim();

    const cantidad =
      parseFloat(
        editCantidad.value
      );

    const mes =
      editMes.value;

    if(!entidad){

      detailsError.textContent =
        "Entidad requerida.";

      return;

    }

    if(
      isNaN(cantidad)
      ||
      cantidad <= 0
    ){

      detailsError.textContent =
        "Cantidad inválida.";

      return;

    }

    const duplicate =
      deudas.find(
        d =>

          d.id !==
          selectedDebt.id

          &&

          d.entidad
            .toLowerCase() ===
          entidad
            .toLowerCase()

          &&

          d.mes === mes

      );

    if(duplicate){

      detailsError.textContent =
        "Ya existe esa entidad en ese mes.";

      return;

    }

    selectedDebt.entidad =
      entidad;

    selectedDebt.mes =
      mes;

    selectedDebt.cantidad =
      cantidad;

    selectedDebt.apartado =
      editApartado.checked;

    saveData();

    detailsModal.classList.remove(
      "active"
    );

    renderAll();

  }
);

/*
====================================
ELIMINAR
====================================
*/

btnDeleteDebt.addEventListener(
  "click",
  () => {

    if(!selectedDebt){
      return;
    }

    const confirmDelete =
      confirm(
        "¿Eliminar deuda?"
      );

    if(!confirmDelete){
      return;
    }

    deudas =
      deudas.filter(
        d =>
          d.id !==
          selectedDebt.id
      );

    saveData();

    detailsModal.classList.remove(
      "active"
    );

    renderAll();

  }
);

btnCloseDetails.addEventListener(
  "click",
  () => {

    detailsModal.classList.remove(
      "active"
    );

  }
);

/*
====================================
MESES
====================================
*/

monthChips.forEach(chip => {

  chip.addEventListener(
    "click",
    () => {

      monthChips.forEach(c =>
        c.classList.remove(
          "active"
        )
      );

      chip.classList.add(
        "active"
      );

      selectedMonth =
        chip.dataset.month;

      renderAll();

    }
  );

});

/*
====================================
GENERAL
====================================
*/

function renderAll(){

  renderEntities();

  renderSummary();

  renderList();

}

/*
====================================
INIT
====================================
*/

activateCurrentMonth();

selectedMonth =
  currentMonth;

mesInput.value =
  currentMonth;

renderAll();
