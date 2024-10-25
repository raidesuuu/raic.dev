import React from 'react';
import { FaSpotify, FaGithub, FaYoutube, FaTwitch, FaInstagram, FaSteam } from 'react-icons/fa';
import { FaBluesky, FaXTwitter } from 'react-icons/fa6';
import { SiKick, SiOsu, SiNamemc } from 'react-icons/si';

const Socials: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className='text-5xl font-bold mb-5 bold-h1'>SNS</h1>

      <p className='text-xl font-bold mb-5'>基本</p>

      <div className="flex flex-wrap space-x-4 mb-10">
        <a href="https://bsky.app/profile/raic.tech" className="button newtab secondary flex items-center space-x-2">
          <FaBluesky /> <span>Bluesky</span>
        </a>

        <a href="https://open.spotify.com/artist/3hdGoSYvBsQhtgpQop28AO?si=n0X-ga5RQVSw3w0B9jCrxA" className="button newtab secondary flex items-center space-x-2">
          <FaSpotify /> <span>Spotify</span>
        </a>

        <a href="https://github.com/raidesuuu" className="button newtab secondary flex items-center space-x-2">
          <FaGithub /> <span>GitHub</span>
        </a>
      </div>

      <p className='text-xl font-bold mb-5'>メディア</p>

      <div className="flex flex-wrap space-x-4 mb-10">
        <a href="https://www.youtube.com/channel/UC4c5qLRRG3HCTmzxH69XBtw" className="button newtab secondary flex items-center space-x-2">
          <FaYoutube /> <span>YouTube</span>
        </a>

        <a href="https://twitch.tv/raisandane" className="button newtab secondary flex items-center space-x-2">
          <FaTwitch /> <span>Twitch</span>
        </a>

        <a href="https://kick.com/raisandesu" className="button newtab secondary flex items-center space-x-2">
          <SiKick /> <span>Kick</span>
        </a>

        <a href="https://instagram.com/raisandayoo" className="button newtab secondary flex items-center space-x-2">
          <FaInstagram /> <span>Instagram</span>
        </a>
      </div>

      <p className='text-xl font-bold mb-5'>X (Twitter)</p>

      <div className="flex flex-wrap space-x-4 mb-10">
        <a href="https://x.com/raic_dev" className="button newtab secondary flex items-center space-x-2">
          <FaXTwitter /> <span>X (Twitter)</span>
        </a>

        <a href="https://x.com/uplauncherxyz" className="button newtab secondary flex items-center space-x-2">
          <FaXTwitter /> <span>UpLauncher</span>
        </a>

        <a href="https://x.com/vistaupdater" className="button newtab secondary flex items-center space-x-2">
          <FaXTwitter /> <span>VistaUpdater</span>
        </a>

        <a href="https://x.com/chatfromrai" className="button newtab secondary flex items-center space-x-2">
          <FaXTwitter /> <span>Rai Chat</span>
        </a>
      </div>

      <p className='text-xl font-bold mb-5'>ゲーム</p>

      <div className="flex flex-wrap space-x-4 mb-10">
        <a href="https://osu.ppy.sh/users/34918440" className="button newtab secondary flex items-center space-x-2">
          <SiOsu /> <span>osu!</span>
        </a>

        <a href="https://namemc.com/profile/voidroom.1" className="button newtab secondary flex items-center space-x-2">
          <SiNamemc /> <span>Minecraft</span>
        </a>

        <a href="https://steamcommunity.com/id/raisandesu" className="button newtab secondary flex items-center space-x-2">
          <FaSteam /> <span>Steam</span>
        </a>
      </div>
    </div>
  );
};

export default Socials;
