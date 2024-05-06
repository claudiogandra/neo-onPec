const StreamData = {
  async read(reader) {
    let receivedLength = 0; // tamanho dos dados recebidos
    let chunks = []; // array para guardar os pedacos de dados

    // Lê os dados do stream
    while(true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }
      
      chunks.push(value);
      receivedLength += value.length;
    }

    // Combina todos os pedaços em um único Uint8Array
    let chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    for(let chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }

    // Converte Uint8Array em string
    let result = new TextDecoder('utf-8').decode(chunksAll);

    // Processa a resposta (assumindo que é JSON)
    let data = JSON.parse(result);
    return data;
  }
}

module.exports = StreamData;
