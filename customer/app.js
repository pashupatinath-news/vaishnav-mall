const firebaseConfig = {
  apiKey:"AIzaSyBCT3-0lITy39_ZVJKXUodwDOwHvWS2MKc",
  authDomain:"vaishnav-mall.firebaseapp.com",
  projectId:"vaishnav-mall",
  storageBucket:"vaishnav-mall.firebasestorage.app"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha',{size:'invisible'});
function sendOTP(){ auth.signInWithPhoneNumber(phone.value, window.recaptchaVerifier).then(cr => { window.confirmationResult = cr; alert("OTP Bhej diya"); }).catch(e=>alert(e.message)); }
function verifyOTP(){ confirmationResult.confirm(otp.value).then(() => { alert("Login Ho Gaya!"); loginBox.style.display='none'; }).catch(e=>alert("Galat OTP")); }

db.collection("products").where("type","==","local").onSnapshot(s=>localProducts.innerHTML=s.docs.map(d=>`<div class="card"><img src="${d.data().photo}"><h4>${d.data().name}</h4><p>₹${d.data().price}</p><button class="btn" onclick="addCart('${d.id}','${d.data().name}','${d.data().price}')">ADD TO CART</button></div>`).join(''));

db.collection("products").where("type","==","affiliate").onSnapshot(s=>affiliateProducts.innerHTML=s.docs.map(d=>`<div class="card affiliate"><img src="${d.data().photo}"><h4>${d.data().name}</h4><p>₹${d.data().price}</p><button class="btn" onclick="window.open('${d.data().link}','_blank')">BUY ON AMAZON</button></div>`).join(''));

db.collection("banner").doc("main").onSnapshot(d=>{ if(d.exists) mainBanner.style.backgroundImage=`url(${d.data().url})`; });

let cart = JSON.parse(localStorage.getItem('cart')) || [];
function updateCartUI(){ cartCount.innerText = cart.length; cartTotal.innerText = cart.reduce((sum,i)=>sum+Number(i.price),0); cartItems.innerHTML = cart.map((c,i)=>`<p>${c.name} - ₹${c.price} <button onclick="removeCart(${i})">X</button></p>`).join(''); }
updateCartUI();
function addCart(id,name,price){cart.push({id,name,price}); localStorage.setItem('cart', JSON.stringify(cart)); updateCartUI(); alert(name+" Cart me add")}
function removeCart(i){cart.splice(i,1); localStorage.setItem('cart', JSON.stringify(cart)); updateCartUI();}

function placeOrder(){
  if(cart.length==0){ alert("Cart khali hai"); return; }
  let phone = prompt("Mobile number daalo");
  let address = prompt("Address daalo");
  let deliveryOTP = Math.floor(1000 + Math.random() * 9000);
  db.collection("orders").add({items: cart, phone: phone, address: address, status: "New", deliveryOTP: deliveryOTP, time: new Date()});
  localStorage.removeItem('cart'); cart=[]; updateCartUI();
  alert("Order Ho Gaya! Delivery OTP: " + deliveryOTP);
  cartBox.style.display='none';
}

function searchProducts(){
  let val = search.value.toLowerCase();
  db.collection("products").where("name",">=",val).where("name","<=",val+'\uf8ff').onSnapshot(s=>localProducts.innerHTML=s.docs.map(d=>`<div class="card"><img src="${d.data().photo}"><h4>${d.data().name}</h4><p>₹${d.data().price}</p><button class="btn" onclick="addCart('${d.id}','${d.data().name}','${d.data().price}')">ADD TO CART</button></div>`).join(''));
}

let time=10799; setInterval(()=>{time--;let h=Math.floor(time/3600);let m=Math.floor((time%3600)/60);let s=time%60;timer.innerText=`${h}:${m}:${s}`},1000);

if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js'); }
