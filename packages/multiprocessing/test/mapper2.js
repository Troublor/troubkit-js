// eslint-disable-next-line no-undef
module.exports = function (v) {
    // eslint-disable-next-line no-undef
    if (process.pid % 2 === 0) {
        throw new Error("even pid");
    }
    return v + 1;
};
