

function checkIfNameExist(players, playerName) {
    if (players.length > 0)
        return Array.from(players, player => { return player.name }).includes(playerName);
    return false;
}

function loadAvatars() {
    return JSON.parse(localStorage.getItem('avatars') || '[]');
}

function saveAvatars(avatars) {
    localStorage.setItem('avatars', JSON.stringify(avatars))
}

function addAvatar(...url) {
    avatars = loadAvatars();

    url.forEach(url => {
        if (!avatars.includes(url)) {
            avatars.push(url);
        }
    });
    saveAvatars(avatars);
}

function getAvatarsInUse(config) {
    return config.players.map(player => {
        let avatar = player.avatar.match(/(?<=\<img src=")[^"]+(?=" title="[^"]+"\>)/);
        return avatar ? avatar[0] : null;
    }).filter(item => { return item !== null });
}

function getAvatarsUnused(config) {
    let avatars = loadAvatars();
    let avatarsInUse = getAvatarsInUse(config);
    return avatars.filter(avatar => { return !avatarsInUse.includes(avatar) });
}


let defaultAvatars = ["https://4.bp.blogspot.com/-oyIQrz5MgfU/W563ftDPG4I/AAAAAAAABTo/Jr7hdDFlADkt3nxWMALEVrUBgjZ6CZLBQCLcBGAs/s400/Articuno_XY.gif",
    "http://pa1.narvii.com/6141/7d80cbc0e114c5c96e6f7b0edf31f0a8cc7d1a32_00.gif",
    "https://bogleech.com/pokemon/sprites/715.gif",
    "https://1.bp.blogspot.com/-GQa8o-brIlA/UrSvPnciV2I/AAAAAAAADrY/914kjQtTD4U/s1600/talonflame-3.gif",
    "https://www.gifss.com/comics/pokemon/images/gif-pokemon-73.gif",
    "https://www.pkparaiso.com/imagenes/xy/sprites/animados/charizard-3.gif",
    "https://www.pkparaiso.com/imagenes/xy/sprites/animados-shiny/talonflame.gif",
    "https://www.pkparaiso.com/imagenes/xy/sprites/animados/lapras-3.gif",
    "https://files.pokefans.net/sprites/xy/animationen/gengar.gif",
    "https://files.pokefans.net/sprites/xy/animationen/697-3.gif"];


addAvatar(...defaultAvatars);


let config = { time: null, players: [], maxPlayersAllowed: QuestionsLib.maxPlayersAllowed() };
let configPopup = document.body.getElementsByClassName('configPopup')[0];
let avatarPopup = document.body.getElementsByClassName('avatarPopup')[0];
let lista = configPopup.getElementsByTagName('ul')[0];

avatarPopup.getElementsByTagName('i')[0].addEventListener('click', _ => {
    let value = avatarPopup.getElementsByTagName('input')[0].value;
    if (value) {
        config.players[avatarPopup.dataset.player].avatar = `<img src="${value}" title="${config.players[avatarPopup.dataset.player].name}">`;
        lista.querySelector(`[data-player="${avatarPopup.dataset.player}"]`).parentElement.innerHTML = `<h2>${config.players[avatarPopup.dataset.player].name}</h2>${config.players[avatarPopup.dataset.player].avatar}`;
        addAvatar(value);
    }
    //lista.innerHTML = '';
    //lista.append(...playerRows(config));
    avatarPopup.style.display = 'none';
    configPopup.style.display = 'flex';
});
let avatarPicker = document.body.getElementsByClassName('avatarPicker')[0];
avatarPicker.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG')
        avatarPopup.getElementsByTagName('input')[0].value = e.target.src;
});




let [nombre, tiempo, tildes] = configPopup.getElementsByTagName('input');



lista.addEventListener('click', (e) => {
    if (e.target.classList.contains('bi-person-bounding-box')) {
        avatarPopup.getElementsByTagName('input')[0].value = null;
        avatarPicker.innerHTML = '';
        getAvatarsUnused(config).forEach(avatar => {
            let img = document.createElement('img');
            img.src = avatar;
            avatarPicker.append(img);
        });
        configPopup.style.display = 'none';
        avatarPopup.style.display = 'flex';
        avatarPopup.dataset.player = e.target.dataset.player;
    }
});


function playerRows(config){
    let rows = [];
    config.players.forEach(player=>{
        let row = document.createElement('li');
        if(/^\<p\>/.test(player.avatar)){
            row.innerHTML = `<h2>${player.name}</h2><i class="bi bi-person-bounding-box" data-player="${config.players.length}"></i>`;
        }else{
            row.innerHTML = `<h2>${player.name}</h2>${player.avatar}`;
        }
        rows.push(row);
    });
    return rows;
}

       
function addPlayer(){
    if(!/^(?!(_{2})|(\-{2}))[a-zA-Z_\-][\w\-]+$/.test(nombre.value)){
        alert(`El nombre no es válido.`);
    }else if (config.players.length >= config.maxPlayersAllowed) {
        alert(`Las palabras que hay dan para ${config.maxPlayersAllowed} jugadores, no hay más.`);
    } else if (nombre.value && !checkIfNameExist(config.players, nombre.value)) {
        nombre.value = nombre.value.replace(' ','_')
        let row = document.createElement('li');
        row.innerHTML = `<h2>${nombre.value}</h2><i class="bi bi-person-bounding-box" data-player="${config.players.length}"></i>`;
        lista.append(row);
        let player = {};
        player.name = nombre.value;
        player.avatar = `<p>${nombre.value}</p>`;
        config.players.push(player);
        nombre.value = null;
    }
}

configPopup.querySelector('i.bi-person-plus-fill').addEventListener('click', _ => {
    addPlayer();
});

nombre.addEventListener('keypress',e=>{
    if(e.key==='Enter'){
        addPlayer();
    }
});

configPopup.getElementsByTagName('button')[0].addEventListener('click', _ => {
    if (tiempo.value && tiempo.value > 0 && config.players.length > 0) {
        config.time = tiempo.value;
        config.accents = tildes.checked;
        configPopup.style.display = 'none';
        new PasaPalabra(config).init();
    }
});
