class UserMedia {

  static async getStream (options) {
    // check if stream exists
    if (typeof this.stream !== 'undefined') { return this.stream } else {
      // default is get audio and video
      if (!options) { options = { audio: true, video: true } }

      // creating the stream and error-handling
      try {
        this.stream = await navigator.mediaDevices.getUserMedia(options)
        return this.stream
      } catch (err) {
        console.log('Error capturing user media:',
          err.name, err.message)
      }
    }
  }

  static async recordAudio (inputAudioId, outputAudioId, record, option) {
    if(typeof this.option == 'undefined')
      this.option = option
    if (typeof this.mediaRecorder !== 'undefined' && this.option == option) {
      if (record) { this.mediaRecorder.start() } else { this.mediaRecorder.stop() }
    } else {
      const stream = await this.getStream({ audio: true })

      // recorded audio referenced by 'audio' variable
      const audio = document.getElementById(inputAudioId)

      // Newer browsers
      if ('srcObject' in audio) { audio.srcObject = stream }
      // Older browsers
      else { audio.src = window.URL.createObjectURL(stream) }

      // Record audio given through stream
      this.mediaRecorder = new MediaRecorder(stream)

      this.mediaRecorder.start()

      // Array to store the audio data
      let audios = []

      // Store new audios in array
      this.mediaRecorder.ondataavailable = (newAudio) => {
        audios.push(newAudio.data)
      }

      // Convert the audio data in the blob to mp3
      // after stopping the recording
      this.mediaRecorder.onstop = () => {
        const savedAudio = document.getElementById(outputAudioId)

        // blob of type mp3
        const audioData = new Blob(audios,
          { type: 'audio/mp3;' })

        // empty array
        audios = []

        // create audio url to reference
        // saved audio
        const audioSrc = window.URL
          .createObjectURL(audioData)

        savedAudio.src = audioSrc
      }

      this.option = option
    }
  }

  static createContext(savedAudio){
    let audioElement = document.getElementById(savedAudio)
    if(audioElement.duration == 'Infinity')
      return Error

    const context = new AudioContext()
    this.analyser = new AnalyserNode(context, { fftSize: 256 })
    const gain = new GainNode(context, { gain: 0.5 })

    // pass it into the audio context
    const source = context.createMediaElementSource(audioElement)
    
    source.connect(gain).connect(this.analyser).connect(context.destination)
  }

  static getAudioIntensity() {
    
    // creating the array with intensities
    const bufferLength = this.analyser.frequencyBinCount
    const inputArray = new Uint8Array(bufferLength)
    this.analyser.getByteFrequencyData(inputArray)

    return inputArray
  }
}

window.UserMedia = UserMedia
