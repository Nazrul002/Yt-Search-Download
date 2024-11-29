const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.api;
};

document.getElementById("searchBtn").addEventListener("click", async () => {
  const keyWord = document.getElementById("searchInput").value.trim();
  const resultsContainer = document.getElementById("results");

  if (!keyWord) {
    alert("Please enter a song name!");
    return;
  }

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
    const videos = response.data.slice(0, 6);
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
        <div class="download-btn" onclick="downloadVideo('${video.id}')">Download MP4</div>
      `;
      resultsContainer.appendChild(videoCard);
    });
  } catch (error) {
    resultsContainer.innerHTML = "Failed to fetch results. Try again.";
    console.error(error);
  }
});

async function downloadVideo(idvideo) {
  try {
    const apiUrl = await baseApiUrl();
    const response = await axios.get(`${apiUrl}/ytDl3?link=${idvideo}&format=mp3`);
    const { title, downloadLink, quality } = response.data;

    window.open(downloadLink, "_blank");
    alert(`Downloading "${title}" in ${quality}`);
  } catch (error) {
    alert("Failed to download the video. Please try again.");
    console.error(error);
  }
}