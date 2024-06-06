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