
class SpotifyMoodColors {
  static generateRandomString () {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < 16; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  static spotifyAuth (clientID, redirectURI) {
    const state = this.generateRandomString()
    //  stores the state on the person's server so can double check it
    window.localStorage.setItem('spotifyString', state)
    const scope = 'user-top-read'
    let url = 'https://accounts.spotify.com/authorize'
    url += '?response_type=token'
    url += '&client_id=' + encodeURIComponent(clientID)
    url += '&scope=' + encodeURIComponent(scope)
    url += '&redirect_uri=' + encodeURIComponent(redirectURI)
    url += '&state=' + encodeURIComponent(state)
    window.location = url
  }

  static async getTopTrack () {
    const token = window.localStorage.getItem('spotifyToken')
    if (!token) {
      return console.error('must run spotifyAuth first')
    }
    const request = 'https://api.spotify.com/v1/me/top/tracks'
    const response = await window.fetch(request, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    const data = await response.json()
    return data.items[0].id
  }

  static async getTempo () {
    const token = window.localStorage.getItem('spotifyToken')
    const topSongID = await this.getTopTrack()
    const request = `https://api.spotify.com/v1/audio-analysis/${topSongID}`
    const response = await window.fetch(request, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    const songData = await response.json()
    return songData.track.tempo
  }

  static async getMood () {
    const tempo = await this.getTempo()
    if (tempo > 200) {
      const mood = 'happy'
      return mood
    } else if (tempo >= 168 && tempo < 200) {
      const mood = 'exuberant'
      return mood
    } else if (tempo >= 120 && tempo < 168) {
      const mood = 'energetic'
      return mood
    } else if (tempo >= 108 && tempo < 120) {
      const mood = 'sad'
      return mood
    } else if (tempo >= 76 && tempo < 108) {
      const mood = 'contentment'
      return mood
    } else if (tempo >= 66 && tempo < 76) {
      const mood = 'calm'
      return mood
    } else if (tempo >= 60 && tempo < 66) {
      const mood = 'chill'
      return mood
    } else if (tempo < 60) {
      const mood = 'depressive'
      return mood
    }
  }

  static async getColors () {
    const mood = await this.getMood()
    const color = []
    if (mood === 'happy') {
      //  lawn green, red, gold, yellow, dodger blue
      color.push('#ffff', '#ffd700', '#7cfc00', '#FFFF00', '#1e90ff')
      return color
    } else if (mood === 'exuberant') {
      //  fuschia, hot pink, aqua, orange, purple
      color.push('#FF00FF', '#00FFFF', '#ff1493', '#ffa500', '#800080')
      return color
    } else if (mood === 'energetic') {
      //  lime, firebrick, lawn green, turqoise, magenta
      color.push('#00ff00', '#b22222', '#7cfc00', '#40e0d0', '#ff00ff')
      return color
    } else if (mood === 'sad') {
      //  navy, dark gray, dark blue, dim gray, seagreen
      color.push('#000080', '#a9a9a9', '#00008b', '#696969', '#2e8b57')
      return color
    } else if (mood === 'contentment') {
      //  light pink, light sky blue, misty rose, coral, lavender
      color.push('#ffb6c1', '#87cefa', '#ffe4e1', '#ff7f50', '#e6e6fa')
      console.log(color)
      return color
    } else if (mood === 'calm') {
      //  medium turquoise, cadet blue, azure, silver, lavender
      color.push('#48d1cc', '#5f9ea0', '#f0ffff', '#C0C0C0', '#e6e6fa')
      return color
    } else if (mood === 'chill') {
      //  cornflower blue, sky blue, lavender, light steel blue, pale turquoise
      color.push('#6495ed', '#00bfff', '#e6e6fa', '#b0c4de', '#afeeee')
      return color
    } else if (mood === 'depressive') {
      //  black, gray, dark slate gray, whitesmoke, white
      color.push('#000000', '#808080', '#2f4f4f', '#f5f5f5', '#ffffff')
      return color
    } else {
      console.log('this is ', mood)
    }
    console.log(color)
    window.alert('your mood from your top song is' + mood)
  }
}

window.SpotifyMoodColors = SpotifyMoodColors
//  check if there's other hashes with access_token
if (window.location.hash.includes('access_token')) {
  const hashArray = window.location.hash.split('=')
  const token = hashArray[1].split('&')[0]
  window.localStorage.setItem('spotifyToken', token)
}
