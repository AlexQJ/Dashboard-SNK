const titanesData = [];
const nombres = [];
const alturas = [];
const listaPortadores = [];
const tipos = [];
const listaHabilidades = [];
const imgPathLista = [];
const coloresFondo = ["#cb8225", "#137e4f", "#ae5000", "#f4cfb7", "#be1c1c", "#eabc04", "#be1c1c", "#f4cfb7", "#fff5ee", "#fff5ee", "#f4cfb7", "#f4cfb7", "#e43e3e", "#f4cfb7"];
const coloresBorde = ["#be1c1c", "#000000", "#e5b513", "#7d9337", "#fff5ee", "#9aceeb", "#addec8", "#addec8", "#addec8", "#e43e3e", "#be1c1c", "#cb8225", "#fff5ee", "#f4cfb7"];

const obtenerTitanes = async () => {
    const corsAnywhere = 'https://cors-anywhere.herokuapp.com/';
    const url = 'https://attack-on-titan-server.herokuapp.com/titans?limit=20&page=1';
    let titanes = [];
    await fetch(corsAnywhere + url, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        })
    })
    .then((response) => response.json())
    .then((data) => {
        titanes.push(data);
    })
    .catch((err) => console.log(err));
    titanes = titanes[0];
    

    for (const key in titanes.titans) {
        if (Object.hasOwnProperty.call(titanes.titans, key)) {
            const element = titanes.titans[key];
            titanesData.push(element)
        }
    }

    obtenerNombres(titanesData);
    obtenerAlturas(titanesData);
    obtenerHabilidades(titanesData);
    obtenerPortadores(titanesData);
    obtenerTipos(titanesData);
    obtenerImagenes(titanesData);
    renderLista(nombres);

    const seleccion = document.querySelector('#seleccion');
    seleccion.addEventListener('change', ()=>{
        const chart = document.querySelector('.canvas');
        chart.innerHTML= "";

        chart.innerHTML = `<canvas id="myChart" width="100%"></canvas>`

        setGraph(titanesData, seleccion.value);
    })
    setGraph(titanesData, seleccion.value)

    return titanesData;
};

const setGraph = (data, seleccion) => {
    let labels = [];
    let colors = [];

    data.forEach(element => {
        labels.push(element.name)
        colors.push(`rgb(${randomNum(0,255)}, ${randomNum(0,255)}, ${randomNum(0,255)})`);
    });

    const alturaTitanes = [];
    data.forEach(element => alturaTitanes.push(element.height));

    const dataConfig = {
      labels: labels,
      datasets: [
        {
          label: "Titans height",
          backgroundColor: coloresFondo,
          borderColor: coloresBorde,
          borderWidth: 5,
          data: alturaTitanes,
        },
      ],
    };
  
    const config = {
      type: seleccion,
      data: dataConfig,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  
    const myChart = new Chart(document.getElementById("myChart"), config);
};

function randomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function obtenerNombres(data){
    data.forEach((titan)=>{nombres.push(titan.name)})
}

function obtenerAlturas(data){
    data.forEach((titan)=>{alturas.push(titan.height)})
}

function obtenerTipos(data){
    data.forEach((titan)=>{
        if(titan.type === "Titan Shifter"){
            tipos.push("Titan Inheritor");
        }else{
            tipos.push(titan.type)
        }
        
    })
}

function obtenerHabilidades(data){
    data.forEach((titan)=>{listaHabilidades.push(titan.abilities)})
}

function obtenerPortadores(data){
    data.forEach((titan)=>{listaPortadores.push(titan.inheritors)})
}

function obtenerImagenes(data){
    data.forEach((titan)=>{imgPathLista.push(titan.image)})
}

function renderLista(nombres){
    const lista = document.querySelector('#lista');
    nombres.forEach((nombre, indice)=>{
        lista.innerHTML+= `<li id="${(indice)}" class="titan"
        onClick="renderStats(${indice})">${nombre}</li>`;
    });
}

function renderStats(i){
    const personaje = document.getElementById(i);

    // mostrar titulo titan
    const title = document.querySelector('#titan_stat_title');
    title.textContent = personaje.textContent + " Stats";

    //mostrar titulo habilidades
    const habilitiesTitle = document.querySelector('#titan_habilities_title')
    habilitiesTitle.textContent = "Habilities"
    // mostrar habilidades
    personaje.addEventListener('click', obtenerHabilidades())

    //mostrar titulo portadores
    const inheritorsTitle = document.querySelector('#titan_inheritors_title')
    inheritorsTitle.textContent = "Inheritors"
    // mostrar portadores
    personaje.addEventListener('click', obtenerPortadores())

    //mostrar titulo alturas
    const heigthTitle = document.querySelector('#titan_heigth_title')
    heigthTitle.textContent = "Heigth"

    //mostrar titulo tipo
    const typeTitle = document.querySelector('#titan_type_title')
    typeTitle.textContent = "Titan Type"

    // mostrar img
    personaje.addEventListener('click', obtenerImagen())

    // mostrar tipo
    personaje.addEventListener('click', obtenerTipo())

    // mostrar altura
    personaje.addEventListener('click', obtenerAltura())

    // confirmar si el elemento esta renderizado
    personaje.addEventListener('click', intercambiarClase())


    function obtenerHabilidades(){
        const contenedorHabilidades = document.getElementById('habilidades');
        contenedorHabilidades.innerHTML = "";
        
        listaHabilidades[i].forEach(habilidad => contenedorHabilidades.innerHTML += `<li>${habilidad}</li>`);
    }

    function obtenerPortadores(){
        const contenedorPortadores = document.getElementById('portadores');
        contenedorPortadores.innerHTML = "";

        listaPortadores[i].forEach(portador => contenedorPortadores.innerHTML += `<li>${portador}</li>`);
    }

    function obtenerAltura(){
        const contenedorAltura = document.getElementById('altura');
        contenedorAltura.innerHTML = `<p>${alturas[i]} mts</p>`;
    }

    function obtenerTipo(){
        const contenedorTipo = document.getElementById('tipo');
        contenedorTipo.innerHTML = `<p>${tipos[i]}</p>`;
    }

    function obtenerImagen(){
        const thumbContainer = document.querySelector('#thumb');
        thumbContainer.innerHTML = `<img src="https://attack-on-titan-server.herokuapp.com/${imgPathLista[i]}" alt="imagen del titan ${nombres[i]}" width="100%">`
    }

    rendered = true
}

function intercambiarClase(){
    let stats = document.querySelector('.notRendered');
    if(stats){
        stats.style.display = "flex";
    }
}

obtenerTitanes();

