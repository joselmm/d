(() => {
  function extraerIdDeVideo(url) {
    const expresion =
      /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([\w-]{11})(?:\S+)?$/;
    const match = url.match(expresion);
    return match ? match[1] : null;
  }
  var videoId = '';
  if (!location.hash) {
    var url = prompt('Ingresa Url de tu video');
    if (url) {
      location.href = location.href.replace('#', '') + '#' + url;
    } else {
      return;
    }
  }
  if (location.hash.includes('youtube.com/watch')) {
    videoId = extraerIdDeVideo(location.hash.substring(1));
  } else {
    videoId = location.hash.substring(1);
  }
  document.querySelector('#video-details').hidden = false;
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
      console.log(object);
      console.log(videoId);
      var thumb = document.querySelector('#thumb');
      thumb.hidden = false;
      function getMetada() {
        fetch(
          `https://script.google.com/macros/s/AKfycbweFjW5hRq2TT5bLj0V9cNxNW_A1jwYXBqS6bFARLZ2g7xCUGKYaqOSqoZqmfEaFkqg/exec?callback=${callBack}&id=${encodeURIComponent(
            object.hash
          )}&datesend=${dateSend}`
        )
          .then((res) => res.json())
          .then((e) => {
            if (!(e.pro_done === '100%')) getMetada();
            var thumb = document.querySelector('#thumb');
            thumb.hidden = false;
            document.querySelector('div h1').innerText = e.title;
            thumb.src = 'https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg';
            // console.log(e.mp3);

            var videoQualityHTML = '';
            for (video of e.mp4) {
              videoQualityHTML += `<a class="btn btn-danger" href="${
                'http://dl103.apiyoutube.cc/' +
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
              audioQualityHTML += `<a class="btn btn-success" href="${
                'http://dl103.apiyoutube.cc/' +
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
})();

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
      <div class="related-videos col-lg-3 col-md-6 col-sm-6 col-xm-12">
      <a href="${location.href.replace(/#.+/, '#')}${video.id}">
      <div>
      
      <img width="80%" src="https://i.ytimg.com/vi/${video.id}/0.jpg">
      <br>
      <span>${video.title}</span>
      </div>
      </a>
      </div>`;
      }
      //console.log(relatedVideosHTML);
      document.querySelector('#related-videos').innerHTML = relatedVideosHTML;
    });
}

window.onpopstate = () => {
  location.reload();
};

document.querySelector('#search-form').onsubmit = (e) => {
  e.preventDefault();
  var searchInput = document.querySelector('#search-input');
  var noValue = document.querySelector('#no-value-search');
  var searchButton = document.querySelector('#search-button');
  var videoDetails = document.querySelector('#video-details');

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
      console.log(results.length);
      var relatedVideosHTML = '';
      console.log(results);
      for (video of results) {
        console.log(video.title)
        relatedVideosHTML += `
      <div class="related-videos col-lg-3 col-md-6 col-sm-6 col-xm-12">
      <a href="${location.href.replace(/#.+/, '#')}${video.id}">
      <div>
      <img width="80%" src="${'https://i.ytimg.com/vi/' + video.id + '/0.jpg'}">
      <br>
      <span>${video.title}</span>
      </div>
      </a>
      </div>

      `;
      }
      //console.log(relatedVideosHTML);
      document.querySelector('#related-videos').innerHTML = relatedVideosHTML;
    });
};
