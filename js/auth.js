async function login(){

const data={
 cedula:document.getElementById("cedula").value,
 password:document.getElementById("pass").value
}

const res = await fetch("https://sipu-backend.onrender.com/auth/login",{
 method:"POST",
 headers:{ "Content-Type":"application/json"},
 body:JSON.stringify(data)
})

const r = await res.json()

if(r.ok){

 localStorage.setItem("user",JSON.stringify(r.user))

 // 👉 REDIRECCIÓN POR ROL
 if(r.user.rol === "Admin"){
   window.location="admin.html"
 }else{
   window.location="dashboard.html"
 }

}else{
 alert("Cédula/pasaporte o contraseña incorrectos")
}
}




async function registrar(){

const data={
 cedula:document.getElementById("cedula").value,
 correo:document.getElementById("correo").value,
 password:document.getElementById("pass").value,
 confirm:document.getElementById("confirm").value
}

if(!data.cedula || !data.correo || !data.password){
 alert("Todos los campos son obligatorios")
 return
}

if(data.password !== data.confirm){
 alert("Las contraseñas no coinciden")
 return
}

const res = await fetch("https://sipu-backend.onrender.com/auth/registro",{
 method:"POST",
 headers:{ "Content-Type":"application/json"},
 body:JSON.stringify(data)
})

const r = await res.json()

if(r.ok){
 alert("Cuenta creada con éxito")
 window.location="index.html"
}else{
 alert(r.msg)
}
}

function volver(){
 window.location="index.html"
}


// ---------------- REDIRECCIONES ----------------
function irRecuperar(){
 window.location.href = "recuperar.html"
}

function irValidacion(){
 window.location.href = "validar.html"
}


// ---------------- RECUPERAR ----------------
async function recuperar(){

 const cedula = document.getElementById("cedula").value

 if(!cedula){
  alert("Ingrese su identificación")
  return
 }

 const res = await fetch(
 "https://sipu-backend.onrender.com/auth/recuperar",{
  method:"POST",
  headers:{ "Content-Type":"application/json"},
  body: JSON.stringify({ cedula })
 })

 const r = await res.json()

 if(r.ok){
  alert("La contraseña fue enviada a su correo")
  window.location.href="index.html"
 }else{
  alert(r.msg)
 }
}


async function validar(){

 const cedula = document.getElementById("cedula").value
 const fecha  = document.getElementById("fecha").value

 if(!cedula || !fecha){
  alert("Complete todos los campos")
  return
 }

 const res = await fetch(
 "https://sipu-backend.onrender.com/auth/validar",{
  method:"POST",
  headers:{ "Content-Type":"application/json"},
  body: JSON.stringify({ cedula, fecha })
 })

 const r = await res.json()

 if(r.ok){
  alert("Credenciales enviadas al correo")
  window.location="index.html"
 }else{
  alert(r.msg)
 }
}