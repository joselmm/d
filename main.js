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
            console.log(e.mp3);
            var otherQualityHTML = '';
            for (video of e.mp4) {
              otherQualityHTML += `<a class="btn btn-danger" href="${
                'http://dl103.apiyoutube.cc/' +
                video.vq +
                '/' +
                object.hash +
                '::no::oc'
              }">MP4 ${video.vq} ${video.vs}</a><br><br>`;
            }
            for (audio of e.mp3) {
              otherQualityHTML += `<a class="btn btn-success" href="${
                'http://dl103.apiyoutube.cc/' +
                audio.aq +
                '/' +
                object.hash +
                '::no::oc'
              }">MP3 ${audio.aq}kbps ${audio.as}</a><br><br>`;
            }
            ///  console.log(otherQualityHTML);

            document.querySelector('#quality').innerHTML = otherQualityHTML;
          })
          .catch((e) => e);
      }

      getMetada();
    })
    .catch((e) => e);
})();

/* fetch(
  'https://script.google.com/macros/s/AKfycbyn-92JTOxCjFR-U3zFUB4GOhoUp06zomignavKvCx_oP2T_I2sii-7kf57X6xs9krO/exec?videoId=' +
    location.hash.substring('1')
)
  .then((res) => res.json())
  .then((w) => {
    console.log(w.converter.mp4['720p'].stream[0].url);
    var otherQuality = w.url.filter((url) => !url.audio && !url.no_audio);
    var jjs = w.url.filter((url) => url.audio && !url.no_audio);
    console.log(jjs);
    var otherQualityHTML = '';
    for (video of otherQuality) {
      otherQualityHTML += `<a class="btn btn-danger" href="${video.url}">calidad ${video.subname}</a><br><br>`;
    }
    document.querySelector('#quality').innerHTML = otherQualityHTML;
    document.querySelector('div h1').innerText = w.meta.title;
    var downloadLink = document.querySelector('#download-link');
    downloadLink.href = w.diffConverter;
    //console.log()
    downloadLink.hidden = false;
    // console.log(w);
    var thumb = document.querySelector('#thumb');
    thumb.hidden = false;
    thumb.src = w.thumb;
  })
  .catch((e) => {
    document.querySelector('#alarm').innerText = e.message;
  }); */
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
      <div class="related-videos col-lg-3 col-md-4 col-sm-6 col-xm-12">
      <a href="${location.href.replace(/#.+/, '#')}${video.id}"><br><img src="${
        video.thumbnails[0].url
      }">
      <span>${video.title}</span>
      </a>
      </div>

      `;
    }
    //console.log(relatedVideosHTML);
    document.querySelector('#related-videos').innerHTML = relatedVideosHTML;
  });
window.onpopstate = () => {
  location.reload();
};
