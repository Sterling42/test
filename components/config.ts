// config.ts
export const statScalings = {
    ATK: (stat: number) => stat * 2,
    DEF: (stat: number) => 1 * stat / (1 + 0.1 * stat), // Modified formula for DEF
    HP: (stat: number) => stat * 50,
    INT: (stat: number) => stat * 2,
    SPD: (stat: number) => stat,
    END: (stat: number) => stat * 5,
    CRIT: (stat: number) => 1.5 * stat / (1 + 0.1 * stat),
    LUCK: (stat: number) => 0.5 * stat / (1 + 0.1 * stat),
    DGN: (stat: number) => 1 * stat / (1 + 0.1 * stat),
  };

  export const statDescriptions = {
    ATK: 'Determines the base damage your character can deal to opponents.',
    DEF: 'Reduces the amount of damage your character takes from opponents\' attacks.',
    HP: 'Represents the total amount of damage your character can take before they are defeated.',
    INT: 'Magic Damage Scaling and increases XP gained.',
    SPD: 'Determines how quickly your character can attack.',
    END: 'Represents your character\'s stamina, affecting how long they can attack with full power.',
    CRIT: 'Affects your character\'s critical damage modifier.',
    LUCK: 'Influences a variety of factors, such as the chance to land a critical hit, the chance to dodge attacks, or the likelihood of getting more gold.',
    DGN: 'Represents your character\'s degeneration.',
  };