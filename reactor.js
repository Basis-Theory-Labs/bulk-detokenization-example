/**
 * Fetch tokens in parallel
 * @param bt
 * @param tokens
 * @returns {Promise<Awaited<unknown>[]>}
 */
const detokenize = (bt, tokens) =>
  Promise.all(
    tokens.map((token) => bt.tokens.retrieve(token).then((t) => t.data))
  );

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
 * Reactor main function
 * @param req
 * @returns {Promise<{raw: {runMillis: number, count: number}}>}
 */
module.exports = async (req) => {
  const hrStart = process.hrtime();

  const {
    bt,
    args: { token, count },
  } = req;

  // mock tokens array
  const tokens = new Array(count).fill(token);

  // split array in several chunks
  const chunks = chunkify(tokens, 10);

  let data = [];
  // sequentially detokenizes 10 tokens per time
  for (let i = 0; i < chunks.length; i++) {
    const chunk = await detokenize(bt, chunks[i]);
    data = [...data, ...chunk];
  }

  // do something with data
  // data[i]

  const hrEnd = process.hrtime(hrStart);
  const runMillis = hrEnd[0] * 1000 + hrEnd[1] / 1000000;

  return {
    raw: {
      count,
      runMillis,
    },
  };
};
