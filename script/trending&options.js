const API_KEY = 'jWJFF6ZVFn7p6nk7dDLNkUpBqUBwK1fU'

if (localStorage.getItem('favGifs') == null){
    var favsList = []
}else{
    var favsList = JSON.parse(localStorage.getItem('favGifs'))
}

const getTrendings = async () => {
    const response = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=3`);
    const data = await response.json()
    return data.data
};

getTrendings()
    .then(response => showTrendings(response))

//Trending Gifs Endpoint
const gifsTrendContainer = document.querySelector('.gifsTrendContainer')

//Crea un div para mostrar cada gif trending obtenido,asignandolo a su imagen de fondo. Llamo la funcion para mostrar las opciones en cada uno
showTrendings = trendings => {
    trendings.forEach(trending => {
        console.log(trending)
        const gifTrend = document.createElement('div')
        const urlGifTrend = "url('"+trending.images.original.url+"')"
        gifTrend.classList.add('gif')
        gifsTrendContainer.insertBefore(gifTrend, gifsTrendContainer.childNodes[2])
        gifTrend.style.backgroundImage=urlGifTrend
        gifTrend.style.backgroundSize = '357px 275px'
        gifsOptions(gifTrend, trending.username, trending.title, trending.id, trending.images.original.url)
    })
}

// GIFS OPTIONS

function gifsOptions (gif, username, gifTitle, gifID, gifURL) {
    gif.addEventListener('mouseenter', async () => {
        const gifOptions = document.createElement('div') 
        gifOptions.classList.add('gifOptions')
        gif.appendChild(gifOptions)
        const addFavsBtn = document.createElement('img')
        const addTrashBtn = document.createElement('img')
        const addDownloadBtn = document.createElement('img')
        const addmaxBtn = document.createElement('img')
        const adduser = document.createElement('p')
        const addtitleGif = document.createElement('p')
        gifOptions.appendChild(addmaxBtn)
        gifOptions.appendChild(addDownloadBtn)
        gifOptions.appendChild(addTrashBtn)
        gifOptions.appendChild(addFavsBtn)
        gifOptions.appendChild(adduser)
        gifOptions.appendChild(addtitleGif)
        addFavsBtn.classList.add('addFavsBtn')
        addTrashBtn.classList.add('trashBtn')
        addDownloadBtn.classList.add('downloadBtn')
        addmaxBtn.classList.add('maxBtn')
        adduser.classList.add('user')
        addtitleGif.classList.add('titleGif')
        let userIF= ''
        username=='' ? userIF='Anonymous' : userIF=username
        adduser.textContent = userIF
        addtitleGif.textContent=gifTitle

        const gifToFavs = gifOptions.parentNode
        let gifInfo = {
            url: gifToFavs.style.backgroundImage,
            username: userIF,
            title: gifTitle,
            id: gifID,
            urlAlone: gifURL
        }

        if(favsList.some(e => e.id === gifInfo.id)){
            console.log('ya esta')
            addFavsBtn.style.display='none'
            addTrashBtn.style.display='block'
            removeFavGif(addFavsBtn, addTrashBtn, gifInfo)
        }else{
            addFavGif(addFavsBtn, addTrashBtn, gifInfo)
            console.log('no esta')
        }
        download(addDownloadBtn, gifInfo)
        expand(addmaxBtn, gifInfo)
    })
    gif.addEventListener('mouseleave', async () => {
        gif.innerHTML=''
    })
}

// ADD FAVORITE GIF

function addFavGif (favBtn, trashBtn, gifInfo) {
    
    favBtn.addEventListener('click', async () =>{
        favsList.push(gifInfo)
        localStorage.setItem('favGifs', JSON.stringify(favsList))
        favBtn.style.display='none'
        trashBtn.style.display='block'
        removeFavGif(trashBtn, favBtn)

    })
}

function removeFavGif (favBtn, trashBtn, gifInfo) {
    trashBtn.addEventListener('click', async () => {
        const index = favsList.map(function(e){return e.title;}).indexOf(gifInfo.title)
        favsList.splice(index, 1)      
        localStorage.setItem('favGifs', JSON.stringify(favsList))
        favBtn.style.display='block'
        trashBtn.style.display='none'
        location.reload()
    })
}

function download (downloadBtn, gifInfo){
    downloadBtn.addEventListener('click', async () => {
        console.log('D E S C A R G A N D O')
    })
}

function expand (addmaxBtn, gifInfo){
    addmaxBtn.addEventListener('click', async () => {
        console.log('Ampliar')
        let overlay = document.createElement('div')
        overlay.classList.add('overlay')
        let gif = document.createElement("img");
        gif.classList.add('gifMax')
        gif.src = gifInfo.urlAlone
        let username = document.createElement("h2");
        username.textContent = gifInfo.username
        let title = document.createElement("h2");
        title.textContent = gifInfo.title
        overlay.appendChild(gif)
        overlay.appendChild(username)
        overlay.appendChild(title)
        document.body.appendChild(overlay)
        let close = document.createElement('img')
        close.classList.add('close')
        close.src = 'images/close.svg'
        overlay.appendChild(close)
        close.addEventListener('click', () => {
            overlay.remove()
        })
    })
}