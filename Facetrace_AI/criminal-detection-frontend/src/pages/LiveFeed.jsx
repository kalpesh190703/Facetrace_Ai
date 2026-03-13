import "../assets/css/liveFeed.css";

function LiveFeed() {
  return (
    <div className="live-container">
      <h1> Live Detection Monitoring</h1>

      <div className="video-grid">
        <div className="video-card">
          <h2> Airport Security Camera</h2>

          <img
            src="http://10.153.23.229:5000/video_feed/Airport%20Security"
            alt="Live Feed"
            className="video-stream"
          />
        </div>
      </div>
    </div>
  );
}

export default LiveFeed;
