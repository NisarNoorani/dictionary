document.getElementById('search-btn').addEventListener('click', () => {
    const word = document.getElementById('word-input').value;
    if (word) {
      fetchWordDefinition(word);
    } else {
      document.getElementById('result').innerHTML = '<p>Please enter a word.</p>';
    }
  });
  
  function fetchWordDefinition(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.title === "No Definitions Found") {
          document.getElementById('result').innerHTML = '<p>No definitions found.</p>';
        } else {
          displayDefinition(data);
        }
      })
      .catch(() => {
        document.getElementById('result').innerHTML = '<p>Error fetching definition.</p>';
      });
  }
  
  function displayDefinition(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results
  
    data.forEach(entry => {
      const phonetics = entry.phonetics.map(phonetic => {
        const audioHTML = phonetic.audio
          ? `<button class="audio-btn" onclick="playSound('${phonetic.audio}')">Play Sound</button>`
          : '';
        return `${phonetic.text || ''} ${audioHTML}`;
      }).join(', ');
  
      const origin = entry.origin || 'N/A';
  
      const meaningsHTML = entry.meanings.map(meaning => {
        const definitionsHTML = meaning.definitions.map(def => `
          <p><strong>Definition:</strong> ${def.definition}</p>
          ${def.example ? `<p><em>Example:</em> ${def.example}</p>` : ''}
        `).join('');
        return `
          <div class="meaning">
            <h3>${meaning.partOfSpeech}</h3>
            ${definitionsHTML}
          </div>
        `;
      }).join('');
  
      resultDiv.innerHTML += `
        <div class="result-item">
          <h2>${entry.word}</h2>
          <p><strong>Phonetics:</strong> ${phonetics}</p>
          <p><strong>Origin:</strong> ${origin}</p>
          ${meaningsHTML}
        </div>
      `;
    });
  }
  
  function playSound(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
  }
  