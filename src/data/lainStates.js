export const lainStates = {
  booting: {
    label: 'Booting',
    art: '      . . . . .      \n   .-[ / / / / ]-.   \n  /   .-------.   \\  \n [   / . . . . \\   ] \n [  [  L / A  ]  ]  \n [   \\ . . . /   ] \n  \\   `-------\'   /  \n   `-[ / / / / ]-\'   \n      . . . . .      ',
    message: 'Initializing this local, scripted interface. No AI service is connecting.',
  },
  idle: {
    label: 'Idle',
    art: '      / / : \\ \\      \n   .-[ : : : : ]-.   \n  /   .-------.   \\  \n [   / :     : \\   ] \n [  [  L / A  ]  ]  \n [   \\ :     : /   ] \n  \\   `-------\'   /  \n   `-[ : : : : ]-\'   \n      \\ \\ : / /      ',
    message: 'Choose a project in the archive. I only show the curated information included in this reference.',
  },
  processing: {
    label: 'Processing',
    art: '      / : / : /      \n   .-[ > > > > ]-.   \n  /   .-------.   \\  \n [   / / : / : \\   ] \n [  [  L / A  ]  ]  \n [   \\ : / : / /   ] \n  \\   `-------\'   /  \n   `-[ < < < < ]-\'   \n      / : / : /      ',
    message: 'Processing-state demonstration. No private files, memory or local models are being accessed.',
  },
  speaking: {
    label: 'Speaking',
    art: '      / | : | \\      \n   .-[ | | | | ]-.   \n  /   .-------.   \\  \n [   / | : | : \\   ] \n [  [  L / A  ]  ]  \n [   \\ : | : | /   ] \n  \\   `-------\'   /  \n   `-[ | | | | ]-\'   \n      \\ | : | /      ',
    message: 'Eli chooses the direction. I help explain the engineering. A case study needs evidence, not invented achievements.',
  },
  disconnected: {
    label: 'Disconnected',
    art: '      / .   . \\      \n   .-[ - - - - ]-.   \n  /   .--- ---.   \\  \n [   / :     : \\   ] \n [  [  L / -  ]  ]  \n [   \\ :     : /   ] \n  \\   `--- ---\'   /  \n   `-[ - - - - ]-\'   \n      \\ .   . /      ',
    message: 'Disconnected-state demonstration. The portfolio still works because it does not depend on a model connection.',
  },
};
