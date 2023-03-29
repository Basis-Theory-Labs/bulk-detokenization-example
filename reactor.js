/**
 * Splits an array in several chunks of fixed length
 * @param array
 * @param chunkSize
 * @returns {*}
 */
const chunkify = (array, chunkSize) =>
  array.reduce((all, one, i) => {
    const ch = Math.floor(i / chunkSize);
    all[ch] = [].concat(all[ch] || [], one);
    return all;
  }, []);

/**
 * Detokenizes a bulk of tokens sequentially
 * @param bt
 * @param tokenIds
 * @returns {Promise<*[]>}
 */
const detokenizeBulk = async (bt, tokenIds) => {
  // splits array in several chunks of 100 records each
  const chunks = chunkify(tokenIds, 100);

  let tokens = [];
  // sequentially detokenizes 100 tokens per time
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const { data } = await bt.tokens.list({
      id: chunk,
      size: chunk.length,
    });
    tokens = [...tokens, ...data];
  }
  return tokens;
};

/**
 * Reactor main function
 * @param req
 * @returns {Promise<{raw: {runMillis: number, count: number}}>}
 */
module.exports = async (req) => {
  const hrStart = process.hrtime();

  const {
    bt,
    args: { tokenIds },
  } = req;

  const tokens = await detokenizeBulk(bt, tokenIds);

  // do something with the tokens

  const hrEnd = process.hrtime(hrStart);
  const runMillis = hrEnd[0] * 1000 + hrEnd[1] / 1000000;

  return {
    raw: {
      count: tokens.length,
      runMillis,
    },
  };
};
