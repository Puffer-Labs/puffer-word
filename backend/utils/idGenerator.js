/**
 *
 * @returns {string} A random string of length 22.
 */
 const generateRandomID = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  module.exports = generateRandomID;