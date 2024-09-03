// script.js
const clientId = '1260650408485982290';
const redirectUri = 'https://discord.com/oauth2/authorize?client_id=1260650408485982290&response_type=code&redirect_uri=https%3A%2F%2Fdiscord.com%2Foauth2%2Fauthorize%3Fclient_id%3D1260650408485982290&scope=identify+email+guilds.members.read';
const scope = 'identify email guilds.members.read';

const discordLoginButton = document.getElementById('discord-login');

discordLoginButton.addEventListener('click', (event) => {
  event.preventDefault(); // Prevent default button click behavior
  const newTabUrl = './verified.html'; // Open new tab with verified.html in the same directory
  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  const newTab = window.open(newTabUrl, '_blank'); // Open new tab with new page URL
  if (newTab) { // Check if the new tab was opened successfully
    setTimeout(() => {
      window.location.href = authUrl; // Redirect to Discord authorization URL after 2 seconds
    }, 1000);
  }
});

// After the user logs in and is redirected back to your website
window.addEventListener('load', () => {
  const code = new URLSearchParams(window.location.search).get('code');
  if (code) {
    fetch(`https://discord.com/api/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        client_id: clientId,
        client_secret: 'rmJ8WkT4AgIqdx19fbbwLJo_fQ17wX6H'
      })
    })
    .then(response => response.json())
    .then(data => {
      const accessToken = data.access_token;
      const guildId = '1259983786352050326'; // Replace with your guild ID
      const roleId = '1259983970964209725'; // Replace with the role ID you want to check

      fetch(`https://discord.com/api/guilds/${guildId}/members/@me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(response => response.json())
      .then(guildData => {
        if (guildData.roles.includes(roleId)) {
          // User has the role, redirect to a different page
          window.location.href = 'verified.html'; // Replace with your desired page
        } else {
          // User does not have the role, send a DM using the bot
          const userId = guildData.user.id;
          fetch(`https://discord.com/api/users/@me/channels`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${botToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              recipient_id: userId
            })
          })
          .then(response => response.json())
          .then(channelData => {
            const channelId = channelData.id;
            fetch(`https://discord.com/api/channels/${channelId}/messages`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${botToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                content: 'Verify in order to use Scorpion'
              })
            });
          })
          .catch(error => console.error(error));
        }
      })
      .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
  }
});