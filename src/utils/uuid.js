//generate new random uuid
export const uuid = function() {
    const s4 = function () {
        return Math.floor(Math.random() * 0x10000).toString(16);
    };
    return `${s4()}${s4()}-${s4()}${s4()}`;
}