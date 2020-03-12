/*
  This Vuex store module manages and stores header data
*/

// Module state
const state = {
    name: 'Untitled Project', // the name of the Project
    author: '',
    bpm: 120, // the tempo, e.g. 120
    timeSignature: [4, 4], // the time signature, e.g. [4, 4],
    PPQ: 0 // the Pulses Per Quarter of the midi file
}

// Mutations
const mutations = {
    setProjectName: (state, ProjectName) => {
        state.name = ProjectName
    },
    setProjectAuthor: (state, ProjectAuthor) => {
        state.author = ProjectAuthor
    },
    setProjectBpm: (state, ProjectBpm) => {
        state.bpm = ProjectBpm
    },
    setProjectPpq: (state, ProjectPpq) => {
        state.PPQ = ProjectPpq
    },
    setProjectTimeSignature: (state, ProjectTimeSignature) => {
        state.timeSignature = ProjectTimeSignature
    }
}

// Actions
const actions = {
}

// Export store module
export default {
    state,
    mutations,
    actions
}