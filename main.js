const $suggestions = document.querySelector('#suggestions');
document.querySelector('#search-form').onsubmit = (e) => {
  e.preventDefault();
  buscarFuncion();
};
var searchInput = document.querySelector('#search-input');
var noValue = document.querySelector('#no-value-search');
var searchButton = document.querySelector('#search-button');
var videoDetails = document.querySelector('#video-details');
function buscarFuncion() {
  if (buscando) {
    return;
  }

  if (!searchInput.value) {
    noValue.hidden = false;
    searchInput.focus();
    setTimeout(() => {
      if (!noValue.hidden) noValue.hidden = true;
    }, 1000);
    return;
  }
  if (!videoDetails.hidden) videoDetails.hidden = true;
  searchButton.disabled = true;
  location.hash = '##' + searchInput.value;
  fetch(
    'https://yt-info-1y11.onrender.com/buscarVideo/' +
      encodeURIComponent(searchInput.value)
  )
    .then((res) => res.json())
    .then((w) => {
      var results = w.items.filter((e) => {
        if (e.type === 'video') {
          return e;
        }
      });
      searchButton.disabled = false;
      //w.items
      //console.log(results.length);
      var relatedVideosHTML = '';
      console.log(results);
      for (video of results) {
        //console.log(video.title)
        relatedVideosHTML += `
      <div class="related-videos col-lg-3 col-md-6 col-sm-12 col-xm-12">
      <a href="${location.href.replace(/#.+/, '#')}${video.id}">
      <div>
      <img width="80%" src="${'https://i.ytimg.com/vi/' + video.id + '/0.jpg'}">
      <br>
      <span>${video.title}</span>
      <br>
      <span>${etiquetarNumero(Number(video.views))}</span>
      </div>
      </a>
      </div>

      `;
      }
      //console.log(relatedVideosHTML);
      document.querySelector('#related-videos').innerHTML = relatedVideosHTML;
      buscando = false;
    });
}

var buscar = false;
window.onpopstate = () => {
  if (location.hash.match(/##.+/)?.length) {
    var value = location.hash.match(/##.+/)[0].substring(2);
    document.querySelector('#search-input').value = decodeURIComponent(value);

    buscarFuncion();
  } else if (location.hash.match(/#.+/)?.length) {
    //location.hash.match(/#.+/)[0]

    analizar();
  }
};
if (location.hash.includes('##')) {
  console.log(location.hash);
  buscar = true;
  if (location.hash.replace('##', '')) {
    document.querySelector('#search-input').value = decodeURIComponent(
      location.hash.replace('##', '')
    );
  }
}
function analizar() {
  if (buscar) {
    return;
  }
  var videoId = '';
  if (!location.hash && !location.hash.includes('##')) {
    var input = prompt('Ingresa Url de tu video');
    if (input) {
      if (input.includes(' ')) {
        location.href = location.href.replace('#', '') + '##' + input;
        return;
      } else {
        location.href = location.href.replace('#', '') + '#' + input;
      }
    } else {
      return;
    }
  }

  if (location.hash.includes('youtube.com/watch')) {
    videoId = extraerIdDeVideo(location.hash.substring(1));
  } else {
    videoId = location.hash.substring(1);
  }

  if (document.querySelector('#alarmador').hidden) {
    document.querySelector('#alarmador').hidden = false;
  }
  if (
    !(document.querySelector('#alarmador').innerText === 'ESPERA UN MOMENTO')
  ) {
    document.querySelector('#alarmador').innerText = 'ESPERA UN MOMENTO';
  }

  document.querySelector('#alarmador').hidden = false;
  document.querySelector('#alarmador').innerText = 'ESPERA UN MOMENTO';
  document.querySelector('#video-details').hidden = true;
  document
    .querySelector('#video-details')
    .setAttribute('data-videoid', videoId);

  document.querySelector('#search-form').scrollIntoView();
  sessionStorage.setItem('convirtiendo', videoId);
  getRelatedVideos();
  var dateSend = Date.now();
  console.log(dateSend);
  var callBack =
    'jQuery' + (Math.random() + '').split('.')[1] + '_' + Date.now();
  console.log(callBack);
  var urlAPI =
    'https://apiyoutube.cc/check.php?callback=' +
    callBack +
    '&v=' +
    videoId +
    '&_=' +
    dateSend;

  fetch(urlAPI)
    .then((res) => res.text())
    .then(async (data) => {
      //https://i.ytimg.com/vi/TUVcZfQe-Kw/hqdefault.jpg
      //console.log(data)
      var preObject = data.split(callBack)[1];
      var json = preObject
        .substring(1)
        .substring(0, preObject.substring(1).length - 1);
      var object = JSON.parse(json);
      if (document.querySelector('#prosessing-title').hidden) {
        document.querySelector('#prosessing-title').hidden = false;
      }
      document.querySelector('#prosessing-title').innerText = object.title;

      //document.querySelector("#alarmador").innerText=object
      var thumb = document.querySelector('#thumb');
      thumb.hidden = false;
      function getMetada() {
        var myAPi = `https://script.google.com/macros/s/AKfycbweFjW5hRq2TT5bLj0V9cNxNW_A1jwYXBqS6bFARLZ2g7xCUGKYaqOSqoZqmfEaFkqg/exec?callback=${callBack}&id=${encodeURIComponent(
          object.hash
        )}&datesend=${dateSend}`;
        /* console.log(myAPi) */
        fetch(myAPi)
          .then((res) => res.json())
          .then((e) => {
            console.log(e);
            document.querySelector('#alarmador').innerText = e.pro_done;
            if (document.querySelector('#prosessing-title').hidden) {
              document.querySelector('#prosessing-title').hidden = false;
            }
            document.querySelector('#prosessing-title').innerText = e.title;

            if (!(e.pro_done === '100%')) {
              if (videoId == sessionStorage.getItem('convirtiendo'))
                setTimeout(() => {
                  getMetada();
                }, 500);
              return;
            }
            document.querySelector('#prosessing-title').hidden = true;
            document.querySelector('#alarmador').hidden = true;
            document.querySelector('#video-details').hidden = false;

            var thumb = document.querySelector('#thumb');
            thumb.hidden = false;
            document.querySelector('div h1#video-title').innerText = e.title;
            thumb.src = 'https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg';
            // console.log(e.mp3);

            var videoQualityHTML = '';
            for (video of e.mp4) {
              videoQualityHTML += `<a data-aq="${
                video.vq
              }" target="_blank" class="btn btn-danger" href="${
                'http://apiyoutube.cc/' +
                video.vq +
                '/' +
                object.hash +
                '::no::oc'
              }">MP4 ${video.vq} ${video.vs}</a><br><br>`;
            }
            document.querySelector('#quality #v-quality').innerHTML =
              videoQualityHTML;

            var audioQualityHTML = '';
            for (audio of e.mp3) {
              audioQualityHTML += `<a data-aq="${
                audio.aq
              }" target="_blank" class="btn btn-success" href="${
                'http://apiyoutube.cc/' +
                audio.aq +
                '/' +
                object.hash +
                '::no::oc'
              }">MP3 ${audio.aq}kbps ${audio.as}</a><br><br>`;
            }
            ///  console.log(otherQualityHTML);

            document.querySelector('#quality #a-quality').innerHTML =
              audioQualityHTML;
          })
          .catch((e) => e);
      }

      getMetada();
    })
    .catch((e) => e);
}

function getRelatedVideos() {
  fetch(
    'https://yt-info-1y11.onrender.com/getInfoFromVideo?videoId=' +
      location.hash.substring('1')
  )
    .then((res) => res.json())
    .then((w) => {
      console.log(w.related_videos);
      //.title .thumbnails[0].url .id .published
      var relatedVideosHTML = '';
      console.log(w.related_videos);
      for (video of w.related_videos) {
        relatedVideosHTML += `
      <div class="related-videos col-lg-3 col-md-6 col-sm-12 col-xm-12">
      <a href="${location.href.replace(/#.+/, '#')}${video.id}">
      <div>
      
      <img width="80%" src="https://i.ytimg.com/vi/${video.id}/0.jpg">
      <br>
      <span>${video.title}</span>
      <br>
      <span>${etiquetarNumero(Number(video.view_count))}</span>
      </div>
      </a>
      </div>`;
      }
      //console.log(relatedVideosHTML);
      document.querySelector('#related-videos').innerHTML = relatedVideosHTML;
    });
}

var buscando = false;

function etiquetarNumero(num) {
  if (Math.abs(num) >= 1e9) {
    // Si el número es un billón o más grande
    const numRedondeado = Math.round(num / 1e9);
    return numRedondeado + 'B';
  } else if (Math.abs(num) >= 1e6) {
    // Si el número es un millón o más grande
    const numRedondeado = Math.round(num / 1e6);
    return numRedondeado + 'M';
  } else if (Math.abs(num) >= 1e3) {
    // Si el número es un mil o más grande
    const numRedondeado = Math.round(num / 1e3);
    return numRedondeado + 'K';
  } else {
    // Si el número es menor que mil
    return num.toString();
  }
}

function extraerIdDeVideo(url) {
  const expresion =
    /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([\w-]{11})(?:\S+)?$/;
  const match = url.match(expresion);
  return match ? match[1] : null;
}

if (buscar) {
  document.querySelector('#search-button').click();
}

analizar();

// APLAYER
/* 
document.onkeydown = (e) => {
  const keyPressed = e.key?.toLowerCase();
  if (keyPressed === 'p' && e.ctrlKey) {
    e.preventDefault();
    document.querySelector('#aplayer').hidden =
      !document.querySelector('#aplayer').hidden;
    document.querySelector('#aplayer').scrollIntoView();
  }
  if (keyPressed === 'a' && e.ctrlKey) {
    e.preventDefault();
    myPlayer.list.add({
      name: document.querySelector('#video-title').innerText,
      videoId: document.querySelector('#video-details').dataset.videoid,
      url: document.querySelector('[data-aq="128"]').href,
      cover: document.querySelector('#thumb').src,
    });
    document.querySelector('#aplayer').scrollIntoView();
  }
};
 */

document.onkeydown = (e) => {
  const keyPressed = e.key?.toLowerCase();

  if (keyPressed === 'a' && e.ctrlKey) {
    e.preventDefault();
    if (!document.querySelector('#video-details').hidden)
      SCM.queue({
        title: document.querySelector('#video-title').innerText,
        url: document.querySelector('[data-aq="128"]').href,
      });
    else alert('espera a que cargue el video');
    /*  myPlayer.list.add({
      name: document.querySelector('#video-title').innerText,
      videoId: document.querySelector('#video-details').dataset.videoid,
      url: document.querySelector('[data-aq="128"]').href,
      cover: document.querySelector('#thumb').src,
    });
    document.querySelector('#aplayer').scrollIntoView(); */
  }
};

var startSearch = 0;
var lastOneSearchTime = 0;

searchInput.oninput = (e) => {
  var valor = e.target.value;
  //console.log(valor);
  if (!valor) {
    document.querySelector('#suggestions').innerHTML = '';
    return;
  }
  /* var funcionToken =(""+Math.random()).split(".")[1]
   */
  startSearch = Date.now();
  var query = encodeURIComponent(valor);
  setTimeout(() => {
    lastOneSearchTime = Date.now();
    if (lastOneSearchTime - startSearch >= 500) {
      fetch(
        'https://script.google.com/macros/s/AKfycbyn-92JTOxCjFR-U3zFUB4GOhoUp06zomignavKvCx_oP2T_I2sii-7kf57X6xs9krO/exec?query=' +
          query
      )
        .then((res) => res.text())
        .then((res) => {
          var object = JSON.parse(res.split(/.+\(/)[1].split(')')[0]);
          var suggestionsList = object[1];
          console.log(suggestionsList);
          if (valor == e.target.value) {
            renderSuggestions(suggestionsList);
          }
        });
    }
  }, 500);
};

function renderSuggestions(list) {
  //console.log(list);
  var content = '';
  for (arreglo of list) {
    content += `
    <div class="suggestion">${arreglo[0]}</div>
    `;
  }
  //content = '<u>' + content + '</u>';
  $suggestions.innerHTML = content;
}

function ubicarSuggestions() {
  var params = searchInput.getBoundingClientRect();
  console.log(params);
  $suggestions.style.left = params.left + 'px';
  $suggestions.style.top = params.bottom + 'px';
  /* console.log(searchInput);
  console.log(params.bottom); */
}
ubicarSuggestions();
