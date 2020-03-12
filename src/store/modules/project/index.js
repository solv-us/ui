/*
  This Vuex store module manages and stores songdata
*/

// Import Header management module
import header from './header'
// Module state
const state = {
    startTime: Number, // the time before the first note plays
    duration: Number, // the time until the last note finishes

    // an array of midi tracks
    colors: ['#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#f1c40f', '#e74c3c'],
    tracks: [
        /* {
          id: 0, // the position of this track in the array
          name: 'First track', // the track name if one was given
          color:''
          notes: [
            {
              midi: Number, // midi number, e.g. 60
              time: Number, // time in seconds
              note: String, // note name, e.g. "C4"
              velocity: Number, // normalized 0-1 velocity
              duration: Number // duration between noteOn and noteOff
            }
          ],
          startTime: Number, // the time before the first note plays
          duration: Number, // the time until the last note finishes
          // midi control changes
          controlChanges: {
            // if there are control changes in the midi file
            '91': [
              {
                number: Number, // the cc number
                time: Number, // time in seconds
                value: Number // normalized 0-1
              }
            ]
          },
          isPercussion: Boolean, // true if this track is on a percussion channel
          channelNumber: Number, // the ID for this channel; 9 and 10 are reserved for percussion
          instrumentNumber: Number, // the ID for this instrument, as defined by the MIDI spec
          instrumentFamily: String, // the name of this instrument's family, as defined by the MIDI spec
          instrument: String // the instrument name, as defined by the MIDI spec
        } */
    ]
}

// Mutations
const mutations = {
    addTrack: (state, track) => {
        // If there is a previous track, set id of this track one higher. If there is no track, use 0
        var previousId = (state.tracks[state.tracks.length - 1]) ? (state.tracks[state.tracks.length - 1].id) : -1
        var id = previousId + 1
        var color = state.colors[id]
        track = {
            id,
            name: 'Track ' + id, // Add +1 because humans start counting at 1
            color,
            sequences: []
        }

        state.tracks.push(track)
    },
    deleteTrack: (state, track) => {
        state.tracks.splice(state.tracks.indexOf(track), 1)
    },
    setTrackName: (state, payload) => {
        var trackId = payload.trackId
        var name = payload.name
        state.tracks.find(x => x.id === trackId).name = name
    },
    addSequence: (state, payload) => {
        var trackId = payload.trackId
        var sequence = payload.sequence

        var previousSeqId
        if (state.tracks[trackId].sequences.length > 0) {
            previousSeqId = state.tracks[trackId].sequences[state.tracks[trackId].sequences.length - 1].id
        } else {
            previousSeqId = -1
        }
        var id = previousSeqId + 1
        sequence.id = id
        state.tracks.find(x => x.id === trackId).sequences.push(sequence)
    },
    deleteSequence: (state, { trackId, sequence }) => {
        state.tracks[trackId].sequences.splice(state.tracks[trackId].sequences.indexOf(sequence), 1)
    },
    loadProject: (state, payload) => {
        console.log(payload)
        state.header = payload.header
        state.tracks = payload.tracks
    }
}

// Actions
const actions = {
    addTestData({ commit  }) {
        for (var i = 0; i < 30; i++) {
            commit('addTrack')
            for (var j = 0; j < 50; j++) {
                commit('addSequence', {
                    'trackId': i,
                    'sequence': {
                        time: Math.floor(100 + j * (Math.random() * 100 + 450)),
                        duration: Math.floor(200 + Math.random() * 300)
                    }
                })
            }
        }
    }
}

// Export store module
export default {
    state,
    mutations,
    actions,
    modules: {
        header
    }
}