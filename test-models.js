const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello");
    console.log(`Success with ${modelName}`);
  } catch (e) {
    console.log(`Failed with ${modelName}:`, e.message);
  }
}

async function run() {
  await testModel("gemini-1.5-pro-latest");
  await testModel("gemini-1.5-pro");
  await testModel("gemini-pro");
  await testModel("gemini-1.5-flash");
}
run();
