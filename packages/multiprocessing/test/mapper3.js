// eslint-disable-next-line no-undef
module.exports = async function (v) {
    // eslint-disable-next-line no-undef
    await new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 500);
    });
    return v + 1;
};
