import React from 'react';
import {
    DiscordMessage,
    DiscordMessages,
  } from "@skyra/discord-components-react";


const Discordpreview = (props) => {
    return (
        <div id="msg-box">
            <DiscordMessages>
            <DiscordMessage author={props.username} avatar={props.avatar}>
            {" "}{props.content}{" "}
          </DiscordMessage>
            </DiscordMessages>
        </div>
    );
}

Discordpreview.defaultProps = {
    username : "No Username",
    content : "No Content",
    avatar : null
}

export default Discordpreview;
