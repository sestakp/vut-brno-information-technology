/**
 * Author: Vojtěch Kulíšek
 */
import "./Stream.css";

const Stream = ({ stream_link }) => {
    let stream = "";
    if (stream_link === null || stream_link === undefined) {
        return ""
    }
    try {
        let stream_url = new URL(stream_link);
        let domain_url = new URL(window.location.href);
        let domain = domain_url.hostname;

        if (stream_url.hostname == "www.youtube.com" || stream_url.hostname == "youtube.com") {
            let stream_id = stream_url.searchParams.get("v");
            if(stream_id == null){
                return "";
            }
            let stream_video_url = "https://www.youtube.com/embed/" + stream_id + "?autoplay=1&mute=1";
            let stream_chat_url = "https://www.youtube.com/live_chat?v=" + stream_id + "&embed_domain=" + domain;
            stream = <div id="presentation_stream" class="shadow sm:rounded-md sm:overflow-hidden">
                <iframe class="video" src={stream_video_url} title="stream" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <iframe class="chat" src={stream_chat_url} title="chat" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        }

        if (stream_url.hostname == "www.twitch.tv" || stream_url.hostname == "twitch.tv"){
            let stream_id = stream_url.pathname;
            stream_id = stream_id.split("/");
            if((stream_id.length-1 == 1 && stream_id[1] != "") || (stream_id.length-1 == 2 && stream_id[1] != "" && stream_id[2] == "")){
                stream_id = stream_id[1];
                let stream_video_url = "https://player.twitch.tv/?channel=" + stream_id + "&muted=true&parent=" + domain;
                let stream_chat_url = "https://www.twitch.tv/embed/" + stream_id + "/chat?parent=" + domain;
                stream = <div id="presentation_stream" class="shadow sm:rounded-md sm:overflow-hidden">
                    <iframe class="video" src={stream_video_url} title="stream" frameborder="0" allow="autoplay" allowfullscreen></iframe>
                    <iframe class="chat" src={stream_chat_url} title="chat" frameborder="0"></iframe>
                </div>
            }
        }

        return stream;
    }
    catch {
        return "";
    }

}

export default Stream;