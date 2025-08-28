// Render kartica na index.html
function render(list){
  const container = document.getElementById('propertiesList');
  if(!container) return;
  container.innerHTML = '';
  list.forEach(n=>{
    const div = document.createElement('div');
    div.className = 'property-card';
    div.innerHTML = `
      <img src="${n.slike[0]}" alt="${n.naslov}">
      <div class="info">
        <h3>${n.naslov}</h3>
        <p><strong>Grad:</strong> ${n.Grad}</p>
        <p><strong>Cijena:</strong> €${n.Cijena.toLocaleString()}</p>
        <p><strong>Površina:</strong> ${n.povrsina} m²</p>
        <a href="nekretnina.html?id=${n.id}">Detaljnije</a>
      </div>`;
    container.appendChild(div);
  });
}

// Primena filtera i pretrage
function applyFilters(){
  const maxPrice = parseInt(document.getElementById('maxPrice').value || 0);
  const minSize = parseInt(document.getElementById('minSize').value || 0);
  const city = document.getElementById('cityFilter').value;
  const sort = document.getElementById('sort').value;
  const search = document.getElementById('searchInput').value.toLowerCase();

  let list = nekretnine.filter(n => 
    (!maxPrice || n.Cijena <= maxPrice) &&
    (!minSize || n.povrsina >= minSize) &&
    (!city || n.Grad === city) &&
    (!search || n.naslov.toLowerCase().includes(search) || n.Grad.toLowerCase().includes(search))
  );

  if(sort==='priceAsc') list.sort((a,b)=>a.Cijena-b.Cijena);
  if(sort==='priceDesc') list.sort((a,b)=>b.Cijena-a.Cijena);
  if(sort==='sizeAsc') list.sort((a,b)=>a.povrsina-b.povrsina);
  if(sort==='sizeDesc') list.sort((a,b)=>b.povrsina-a.povrsina);

  render(list);
}

// Inicijalizacija na index.html
if(document.getElementById('propertiesList')){
  render(nekretnine);
  document.getElementById('applyBtn').addEventListener('click', applyFilters);
}

// Detalji na nekretnina.html
if(window.location.pathname.endsWith('nekretnina.html')){
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const n = nekretnine.find(x=>x.id===id) || nekretnine[0];

  document.getElementById('propTitle').textContent = n.naslov;
  document.getElementById('propCity').textContent = n.Grad;
  document.getElementById('propPrice').textContent = n.Cijena.toLocaleString();
  document.getElementById('propSize').textContent = n.povrsina;
  document.getElementById('propDesc').textContent = n.opis;

  window.images = n.slike;
  window.currentImage = 0;
  function setImg(){ document.getElementById('galleryImage').src = images[currentImage]; }
  window.nextImage = ()=>{ currentImage = (currentImage+1) % images.length; setImg(); }
  window.prevImage = ()=>{ currentImage = (currentImage-1+images.length) % images.length; setImg(); }
  setImg();
}
