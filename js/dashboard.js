const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location = "index.html";
}

window.onload = async () => {
    // 1. Cargar Datos Básicos
    document.getElementById("lbl_nombre_lateral").innerText = `${user.nombres}\n${user.apellidos}`;
    
    // Cargar ficha si existen los elementos
    if(document.getElementById("f_cedula")) {
        document.getElementById("f_cedula").innerText = user.cedula || "N/A";
        document.getElementById("f_nombre").innerText = `${user.nombres} ${user.apellidos}`;
        document.getElementById("f_correo").innerText = user.correo || "N/A";
        document.getElementById("f_telefono").innerText = user.telefono || "N/A";
        document.getElementById("f_nota").innerText = user.nota_grado ? user.nota_grado : "9.50"; 
    }

    // 2. Cargar Estado
    await cargarEstadoGeneral();
};

function show(id) {
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".menu-btn").forEach(b => b.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    
    const btns = document.querySelectorAll(".menu-btn");
    if(id === 'inicio') btns[0].classList.add("active");
    if(id === 'ficha') btns[1].classList.add("active");
}

async function cargarEstadoGeneral() {
    try {
        const res = await fetch(`https://sipu-backend.onrender.com/dashboard/resumen/${user.cedula}`);
        const data = await res.json();

        // ELEMENTOS DOM
        const statusRn = document.getElementById("status_rn");
        const cardRn = document.getElementById("card_rn");
        const containerBtn = document.getElementById("container_btn_inscripcion");
        const cardIns = document.getElementById("card_ins");
        
        // Limpiamos el "Cargando..." inmediatamente
        containerBtn.innerHTML = "";

        // --- 1. REGISTRO NACIONAL ---
        let rnHabilitado = false;
        if (data.registro_nacional === "HABILITADO") {
            rnHabilitado = true;
            cardRn.classList.add("done-step");
            statusRn.innerHTML = "<b style='color:#27ae60'>✔ HABILITADO</b>";
        } else if (data.registro_nacional === "CONDICIONADO") {
            statusRn.innerHTML = "<b style='color:#f39c12'>⚠ CONDICIONADO</b>";
        } else {
            statusRn.innerHTML = "<b style='color:#c0392b'>❌ NO HABILITADO</b>";
        }

        // --- 2. INSCRIPCIÓN (Lógica INVALIDADO) ---
        const estadoReal = data.estado_inscripcion_real; // Viene del Python

        if (estadoReal === "INVALIDADO") {
            // CASO 1: ESTUDIANTE INVALIDADO
            cardIns.classList.remove("active-step", "done-step");
            cardIns.style.borderLeft = "5px solid #c0392b"; // Borde Rojo
            cardIns.style.background = "#fff5f5"; // Fondo rojizo suave
            
            containerBtn.innerHTML = `
                <div style="color:#c0392b; font-weight:bold; margin-bottom:5px;">🚫 ANULADA</div>
                <div style="font-size:12px; color:#c0392b;">
                    Inscripción invalidada por administración.
                </div>
            `;
        } 
        else if (data.inscripcion === "COMPLETADA" || estadoReal === "registrado" || estadoReal === "REGISTRADO") {
            // CASO 2: INSCRITO CORRECTAMENTE
            cardIns.classList.add("done-step");
            cardIns.style.borderLeft = ""; // Reset estilo
            cardIns.style.background = ""; 
            
            containerBtn.innerHTML = `
                <div style="color:#27ae60; font-weight:bold; margin-bottom:5px;">✔ INSCRITO</div>
                <button onclick="descargarComprobante()" class="btn-action btn-green">
                    <i class="fas fa-file-pdf"></i> Comprobante
                </button>
            `;
        } 
        else {
            // CASO 3: PENDIENTE (Verificar RN)
            if (rnHabilitado) {
                cardIns.classList.add("active-step");
                containerBtn.innerHTML = `
                    <div style="color:#e67e22; margin-bottom:5px;">Pendiente</div>
                    <button onclick="irAInscripcion()" class="btn-action btn-blue">
                        <i class="fas fa-pen"></i> Inscribirse
                    </button>
                `;
            } else {
                cardIns.classList.add("blocked-step");
                containerBtn.innerHTML = `
                    <div style="color:#c0392b; font-weight:bold;">Inscripción Bloqueada</div>
                    <small>Requiere Registro Nacional Habilitado</small>
                `;
            }
        }

        // --- 3. EVALUACIÓN ---
        const statusExa = document.getElementById("status_exa");
        const cardExa = document.getElementById("card_exa");
        
        if (estadoReal === "INVALIDADO") {
             // Si está invalidado, bloqueamos evaluación también
             cardExa.style.borderLeft = "5px solid #c0392b";
             statusExa.innerHTML = "<b style='color:#c0392b'>🚫 BLOQUEADO</b>";
        } else if (data.examen === "RENDIDO") {
            cardExa.classList.add("done-step");
            statusExa.innerHTML = "<b style='color:#27ae60'>✔ RENDIDO</b>";
        }

        // --- 4. ASIGNACIÓN ---
        const statusRes = document.getElementById("status_res");
        if(data.asignacion === "ASIGNADO"){
            document.getElementById("card_res").classList.add("done-step");
            statusRes.innerHTML = "<b style='color:#27ae60'>✔ CUPO ASIGNADO</b>";
        }

    } catch (e) {
        console.error("Error al conectar", e);
        // Si hay error, mostrarlo en la tarjeta para que no quede "Cargando..."
        const containerBtn = document.getElementById("container_btn_inscripcion");
        if(containerBtn) containerBtn.innerHTML = "<small style='color:red'>Error de conexión</small>";
    }
}

function irAInscripcion() { window.location.href = "inscripcion.html"; }
function descargarComprobante() { window.open(`https://sipu-backend.onrender.com/certificados/inscripcion/${user.cedula}`); }
function logout() { localStorage.clear(); window.location = "index.html"; }