const models = [
  { name: "text-davinci-003", perTokenCost: 0.002 },
  { name: "text-curie-001", perTokenCost: 0.0002 },
  { name: "text-babbage-001", perTokenCost: 0.00005 },
  { name: "text-ada-001", perTokenCost: 0.00004 },
];

function calcCostFromTokens(tokenAmount, modelName) {
  if (modelName && tokenAmount) {
    let perToken = models.find((obj) => obj.name == modelName);
    let totalCost = parseInt(tokenAmount) * perToken.perTokenCost;
    //returns value in Cents unit
    return totalCost || 0;
  }
  return 0;
}

export { models, calcCostFromTokens };
