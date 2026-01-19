const user = JSON.parse(localStorage.getItem("user"))

if(!user){
 window.location="index.html"
}

let periodo = null
let ies = null
let modalidad = null

const btn = document.querySelector(".btn-main")

// ===================== CARGA DATOS =====================

async function init(){

 btn.disabled = true
 btn.innerText = "Cargando datos..."

 try{

  // PERIODO
  const p = await fetch(
  "https://sipu-backend.onrender.com/evaluacion/periodo-activo")
  const per = await p.json()

  if(!per){
   alert("❌ No existe periodo activo")
   return
  }
  periodo = per.idperiodo

  // IES
  const i = await fetch(
  "https://sipu-backend.onrender.com/evaluacion/ies/"+user.cedula)
  const uni = await i.json()

  if(!uni){
   alert("❌ No estás inscrito en ninguna universidad")
   return
  }
  ies = uni.ies_id

  // MODALIDAD
  const m = await fetch(
  "https://sipu-backend.onrender.com/evaluacion/config-modalidad")
  const mod = await m.json()

  if(mod.error){
   alert("❌ "+mod.error)
   return
  }

  modalidad = convertirModalidad(mod.valor)

  // OK
  btn.disabled = false
  btn.innerText = "Enviar evaluación"

  mostrarModalidad(mod.valor)

 }catch(e){
  alert("Error cargando datos")
  console.log(e)
 }
}

// ===================== MODALIDAD =====================

function convertirModalidad(valor){

 if(valor=="PRESENCIAL") return 1
 if(valor=="VIRTUAL") return 2
 if(valor=="SUFICIENCIA") return 3

 return null
}

function mostrarModalidad(txt){

 document.getElementById("modalidad").innerHTML=
 `<option>${txt}</option>`
}

// ===================== RENDIR =====================

async function rendir(){
    
 if(!periodo){
 alert("No existe periodo activo")
 return
 }

if(!ies){
 alert("No estás inscrito")
 return
 }

if(!modalidad){
 alert("No existe configuración de examen")
 return
 }


 const p = Number(puntaje.value)

 if(p < 0 || p > 1000){
  alert("Puntaje inválido")
  return
 }

 const data={
  periodo_id:periodo,
  ies_id:ies,
  identificacion:user.cedula,
  modalidad:modalidad,
  examen:"N",
  tipo:"GENERAL",
  asistio:1,
  puntaje:p,
  deshonestidad:0,
  discapacidad:0,
  adaptada:"N"
 }

 const res = await fetch(
 "https://sipu-backend.onrender.com/evaluacion/rendir",{
  method:"POST",
  headers:{ "Content-Type":"application/json"},
  body:JSON.stringify(data)
 })

 const r = await res.json()

 if(r.ok){
  alert("✅ Evaluación registrada")
  window.location="dashboard.html"
 }else{
  alert("❌ "+r.error)
 }
}

function volver(){
 window.location="dashboard.html"
}

// ===================== INIT =====================

init()
