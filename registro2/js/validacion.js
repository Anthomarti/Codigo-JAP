// ====== refs ======
const form       = document.querySelector("form");
const nombre     = document.getElementById("nombre");
const apellido   = document.getElementById("apellido");
const email      = document.getElementById("email");
const pass1      = document.getElementById("password1");
const pass2      = document.getElementById("password2");
const btnTerminos= document.querySelector('[data-bs-target="#modalTerminos"]');
const modalEl    = document.getElementById("modalTerminos");
const chkTerm    = document.getElementById("terminos");
const contenedor = document.getElementById("contenedor");

// Desactiva validación nativa del navegador
form.setAttribute("novalidate", "");

// Insertamos un texto junto al botón de Términos para feedback
const termMsg = document.createElement("span");
termMsg.className = "ms-2 small";
btnTerminos.parentElement.appendChild(termMsg);

// Utilidades para feedback de campos
function ensureInvalidFeedback(el) {
  // si no existe un div.invalid-feedback justo después, lo creo
  let fb = el.parentElement.querySelector(".invalid-feedback");
  if (!fb) {
    fb = document.createElement("div");
    fb.className = "invalid-feedback";
    el.parentElement.appendChild(fb);
  }
  return fb;
}

function setInvalid(el, msg) {
  el.classList.remove("is-valid");
  el.classList.add("is-invalid");
  ensureInvalidFeedback(el).textContent = msg;
}

function setValid(el) {
  el.classList.remove("is-invalid");
  el.classList.add("is-valid");
  // si existe invalid-feedback, lo dejamos vacío
  const fb = el.parentElement.querySelector(".invalid-feedback");
  if (fb) fb.textContent = "";
}

// ====== Validaciones por campo ======
function validarNombre() {
  if (!nombre.value.trim()) {
    nombre.setCustomValidity("Debe ingresar un nombre.");
    setInvalid(nombre, nombre.validationMessage);
    return false;
  }
  nombre.setCustomValidity("");
  setValid(nombre);
  return true;
}

function validarApellido() {
  if (!apellido.value.trim()) {
    apellido.setCustomValidity("Debe ingresar un apellido.");
    setInvalid(apellido, apellido.validationMessage);
    return false;
  }
  apellido.setCustomValidity("");
  setValid(apellido);
  return true;
}

function validarEmail() {
  const val = email.value.trim();
  if (!val) {
    email.setCustomValidity("Debe ingresar un email.");
  } else if (!email.checkValidity()) {
    // type="email" marcará typeMismatch si no es válido
    email.setCustomValidity("Debe ingresar un email válido.");
  } else {
    email.setCustomValidity("");
  }

  if (email.validationMessage) {
    setInvalid(email, email.validationMessage);
    return false;
  }
  setValid(email);
  return true;
}

function validarPass1() {
  const val = pass1.value;
  if (!val) {
    pass1.setCustomValidity("Debe ingresar una contraseña.");
  } else if (val.length < 6) {
    pass1.setCustomValidity("Debe ingresar una contraseña con al menos 6 caracteres.");
  } else {
    pass1.setCustomValidity("");
  }

  if (pass1.validationMessage) {
    setInvalid(pass1, pass1.validationMessage);
    return false;
  }
  setValid(pass1);
  return true;
}

function validarPass2() {
  // Regla especial: Solo se valida si pass1 está validada
  const pass1Ok = validarPass1(); // asegura estado actualizado
  if (!pass1Ok) {
    pass2.setCustomValidity('Debe ser igual a "contraseña".');
    setInvalid(pass2, pass2.validationMessage);
    return false;
  }

  if (!pass2.value) {
    pass2.setCustomValidity("Debe repetir la contraseña.");
  } else if (pass2.value !== pass1.value) {
    pass2.setCustomValidity('Debe ser igual a "contraseña".');
  } else {
    pass2.setCustomValidity("");
  }

  if (pass2.validationMessage) {
    setInvalid(pass2, pass2.validationMessage);
    return false;
  }
  setValid(pass2);
  return true;
}

// ====== Términos y condiciones (3 lugares) ======
function validarTerminos() {
  const ok = chkTerm.checked;

  // 1) El propio checkbox dentro del modal
  chkTerm.classList.toggle("is-invalid", !ok);
  chkTerm.classList.toggle("is-valid", ok);

  // 2) El botón que abre el modal
  btnTerminos.classList.toggle("text-danger", !ok);
  btnTerminos.classList.toggle("text-success", ok);

  // 3) Un texto al lado del botón
  if (!ok) {
    termMsg.className = "ms-2 small text-danger";
    termMsg.textContent = "Debe aceptar los términos del servicio.";
  } else {
    termMsg.className = "ms-2 small text-success";
    termMsg.textContent = "";
  }

  return ok;
}

// ====== Validación global ======
function validarTodo() {
  const v1 = validarNombre();
  const v2 = validarApellido();
  const v3 = validarEmail();
  const v4 = validarPass1();
  const v5 = validarPass2();
  const v6 = validarTerminos();

  // checkValidity del form ayuda a coherencia general
  return v1 && v2 && v3 && v4 && v5 && v6 && form.checkValidity();
}

// ====== Comportamiento: feedback luego de primer submit y en tiempo real ======
let intentadoEnviar = false;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();

  intentadoEnviar = true;

  const ok = validarTodo();
  if (ok) {
    // simulamos envío exitoso
    alert("¡Formulario enviado correctamente!");
    form.reset();

    // limpiar estados
    [nombre, apellido, email, pass1, pass2, chkTerm].forEach(el => {
      el.classList.remove("is-valid", "is-invalid");
    });
    termMsg.textContent = "";
    btnTerminos.classList.remove("text-danger", "text-success");
  }
});

// Luego del primer submit, validar en tiempo real
[nombre, apellido, email, pass1, pass2].forEach((el) => {
  el.addEventListener("input", () => {
    if (!intentadoEnviar) return;
    switch (el) {
      case nombre:   validarNombre(); break;
      case apellido: validarApellido(); break;
      case email:    validarEmail(); break;
      case pass1:
        validarPass1();
        validarPass2(); // pass2 depende de pass1
        break;
      case pass2:    validarPass2(); break;
    }
  });
});

// Terminos en tiempo real (dentro del modal)
chkTerm.addEventListener("change", () => {
  if (!intentadoEnviar) return;
  validarTerminos();
});

// Al abrir el modal, enfocamos el checkbox para comodidad
const modal = new bootstrap.Modal(modalEl);
modalEl.addEventListener("shown.bs.modal", () => chkTerm.focus());
