const axios = require('axios');

// OAuth link parameters
const clientId = '1260650408485982290';
const redirectUri = 'https://scorpionpredictor.github.io/';
const scope = 'email identify guilds.join guilds.members.read guilds';
const roleId = '1259983970964209725';
const guildId = '1259983786352050326';

// Function to exchange code for access token
async function getAccessToken(code) {
  const response = await axios.post(`https://discord.com/api/oauth2/token`, {
    client_id: clientId,
    client_secret: '5II_1Fv-ez1b-oIii9UcToKWHS2YSc06', // Replace with your client secret
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  });
  return response.data.access_token;
}

// Function to fetch user's guilds and check for role
async function checkUserRole(accessToken) {
  const response = await axios.get(`https://discord.com/api/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const guilds = response.data;
  const userGuild = guilds.find((guild) => guild.id === guildId);
  if (!userGuild) {
    return false; // User is not in the guild
  }
  const guildMemberResponse = await axios.get(`https://discord.com/api/guilds/${guildId}/members/${userGuild.user.id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const guildMember = guildMemberResponse.data;
  return guildMember.roles.includes(roleId);
}

// Handle OAuth redirect
async function handleOAuthRedirect(req, res) {
  const code = req.query.code;
  if (!code) {
    return res.status(401).send('No code provided');
  }
  try {
    const accessToken = await getAccessToken(code);
    const hasRole = await checkUserRole(accessToken);
    if (hasRole) {
      // User has the role, handle accordingly
      res.send('User has the role!');
    } else {
      // User does not have the role, handle accordingly
      res.send('User does not have the role');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error handling OAuth redirect');
  }
}
