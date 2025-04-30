const huggingface = require('./huggingface');
//const openai = require('./openai'); 


const providers = [huggingface]//, openai]; //aca se puede agregar las que queremos


function timeoutPromise(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms)),
  ]);
}

async function getInterviewQuestions(cvText) {
  for (const provider of providers) {
    try {
      console.log(`Probando con proveedor: ${provider.name}`);
      const result = await timeoutPromise(provider.getQuestions(cvText), 20000); 
      if (result && result.length > 0) return result;
    } catch (error) {
      console.warn(`${provider.name} falló: ${error.message}`);
    }
  }

  throw new Error('Todos los proveedores fallaron.');
}

module.exports = { getInterviewQuestions };
