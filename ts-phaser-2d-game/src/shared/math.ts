export const getMoveValueSpread = (spread: number) => {
    const randomOffset = (Math.random() - 0.5) * 2 * spread;
    const randomNumber = 1 + randomOffset;
    return randomNumber;
};

export const getRandomItem = <T>(array: T[]) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};
