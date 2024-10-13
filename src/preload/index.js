const { contextBridge, ipcRenderer } = require('electron')
const path = require('path')

contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => {
    const validChannels = [
      'fetch-students',
      'fetch-exams',
      'fetch-exam-results',
      'fetch-all-exam-results',
      'post-student',
      'post-exam-result',
      'post-exam'
    ]
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    } else {
      console.error(`Invalid channel: ${channel}`)
    }
  },

  receive: (channel, func) => {
    const validChannels = [
      'students-response',
      'exams-response',
      'exam-results-response',
      'all-exam-results-response',
      'post-student-response',
      'post-exam-result-response',
      'post-exam-response'
    ]
    if (validChannels.includes(channel)) {
      if (typeof func === 'function') {
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      } else {
        console.error(`Listener must be a function, received ${typeof func}`)
      }
    }
  },

  off: (channel, func) => {
    const validChannels = [
      'students-response',
      'exams-response',
      'exam-results-response',
      'all-exam-results-response',
      'post-student-response',
      'post-exam-result-response',
      'post-exam-response'
    ]
    if (validChannels.includes(channel)) {
      if (typeof func === 'function') {
        ipcRenderer.removeListener(channel, func)
      } else {
        console.error(`Listener must be a function, received ${typeof func}`)
      }
    }
  },

  getDirname: () => path.dirname(process.execPath)
})
