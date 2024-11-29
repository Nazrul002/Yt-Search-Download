const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.api;
};

document.getElementById("searchBtn").addEventListener("click", async () => {
  let keyWord = document.getElementById("searchInput").value.trim();
  const resultsContainer = document.getElementById("results");

  if (!keyWord) {
    alert("Please enter a song name or YouTube URL!");
    return;
  }

  const urlRegex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
  const match = keyWord.match(urlRegex);
  if (match) keyWord = match[1];

  resultsContainer.innerHTML = `
    <div class="loading-spinner">
      <div></div>
      <div></div>
      <div></div>
    </div>
  `;

  try {
    const apiUrl = await baseApiUrl();
    const response = await axios.get(`${apiUrl}/ytFullSearch?songName=${keyWord}`);
    const videos = response.data//.slice(0, 6);

    if (videos.length === 0) {
      resultsContainer.innerHTML = `<p>No results found for "${keyWord}"</p>`;
      return;
    }

    resultsContainer.innerHTML = "";

    videos.forEach((video) => {
      const videoCard = document.createElement("div");
      videoCard.className = "video-card";

      videoCard.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}">
        <div class="info">
          <h4>${video.title}</h4>
          <div class="channel">
            <img src="${video.channel.thumbnail}" alt="${video.channel.name}">
            <span>${video.channel.name}</span>
          </div>
          <p>Duration: ${video.time}</p>
        </div>
      <div class="actions">
  <button class="play-btn" onclick="playVideo('${video.id}')">Play Now</button>
  <div class="download-btn-container">
    <button class="download-btn-mp3" onclick="downloadMedia('${video.id}', 'mp3')">Download MP3</button>
    <button class="download-btn-mp4" onclick="downloadMedia('${video.id}', 'mp4')">Download MP4</button>
  </div>
</div>
      `;
      resultsContainer.appendChild(videoCard);
    });
  } catch (error) {
    resultsContainer.innerHTML = "Failed to fetch results. Try again.";
    console.error(error);
  }
});

async function playVideo(videoId) {
  try {
    const apiUrl = await baseApiUrl();
    const response = await axios.get(`${apiUrl}/ytDlfuk?link=${videoId}&format=mp4`);
    const { downloadLink } = response.data;
     let player = document.getElementById("mediaPlayer");
    if (!player) {
      player = document.createElement("audio");
      player.id = "mediaPlayer";
      player.controls = true; //play, pause, volume controls
      player.style.position = "fixed";
      player.style.bottom = "10px";
      player.style.left = "10px";
      player.style.zIndex = "1000";
      player.style.width = "300px"; //width for the player
      document.body.appendChild(player);
    }

    player.src = downloadLink;
    player.play(); 
  } catch (error) {
    console.error("Error playing the video:", error);
    alert("Failed to play the video. Please try again.");
  }
}

async function downloadMedia(videoId, format) {
  try {
    const apiUrl = await baseApiUrl();
    const response = await axios.get(`${apiUrl}/ytDl3?link=${videoId}&format=${format || "mp4"}`);
    const { title, downloadLink } = response.data;

    //window.open(downloadLink, "_blank");
        fetch(downloadLink)
                    .then(response => response.blob())
                    .then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                    a.download = 'video.mp4';
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                    })
                    .catch(error => {
                        console.error('Error fetching the video file:', error);
                        alert('Failed to download video. Please try again.');
                    });
    alert(`Downloading "${title}" as ${format.toUpperCase()}`);
  } catch (error) {
    alert("Failed to download. Please try again.");
    console.error(error);
  }
}
