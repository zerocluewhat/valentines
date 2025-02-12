
let messages = [];
let currentIndex = 0;
let hasSelectedYes = false;

const noButtonPhrases = [
  "Please say yes Atlas! 🥺",
  "Are you sure baby boy? 😢",
  "Pretty please my prince? 💕",
  "PLEASEEEEEE 😭",
  "Pookie please! 😘",
  "Darling I love you so so much please i am begging!",
  "SYMPATHY please? 🌹",
  "you are my stars, pleaseee 💔"
];
let currentPhraseIndex = 0;

function isValentinesDay() {
  const today = new Date();
  return today.getMonth() === 1 && today.getDate() === 14;
}

function checkValentinesStatus() {
  const today = new Date();
  if (today.getMonth() > 1 || (today.getMonth() === 1 && today.getDate() > 14)) {
    document.body.innerHTML = '<div class="container"><div class="letter-container"><h1>This Valentine\'s message has expired.</h1></div></div>';
    return false;
  }
  return true;
}

function showInitialPrompt() {
  document.querySelector('.letter-container').innerHTML = `
    <h1>Would you like to be my Valentine?</h1>
    <button id="yes-button" class="choice-button">Yes ❤️</button>
    <button id="no-button" class="choice-button">No 💔</button>
  `;
  
  document.getElementById('yes-button').addEventListener('click', handleYesClick);
  document.getElementById('no-button').addEventListener('click', handleNoClick);
}

async function sendDiscordNotification(message) {
  const webhookUrl = 'https://discord.com/api/webhooks/1329063053400080444/zyfa6KPwLeGlpr_o6MW-avuOZGqnCIPumEzaYfTFtONNQ6MW2S_TgqSKI8l4H-9tjbjn';
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message }),
    });
  } catch (error) {
    console.error('Error sending webhook:', error);
  }
}

function handleYesClick() {
  hasSelectedYes = true;
  localStorage.setItem('hasSelectedYes', 'true');
  sendDiscordNotification('cap he said yes');
  
  if (isValentinesDay()) {
    loadMessages();
  } else {
    document.querySelector('.letter-container').innerHTML = `
      <img src="valentines.gif" alt="Valentine's Day" style="max-width: 300px; margin-bottom: 20px;">
      <h1>Thank you for saying Yes my love! You can't open the letter until Valentine's Day but for now I'm happy to give you all the love I can in our messages! We'll be together soon ❤️ </h1>
    `;
  }
}

function handleNoClick() {
  currentPhraseIndex = (currentPhraseIndex + 1) % noButtonPhrases.length;
  document.getElementById('no-button').textContent = noButtonPhrases[currentPhraseIndex];
  sendDiscordNotification('cap he said no');
}

async function loadMessages() {
  if (!checkValentinesStatus()) return;
  
  try {
    const response = await fetch('messages.json');
    const data = await response.json();
    messages = data.messages;
    displayLetter(0);
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

function displayLetter(index) {
  const letter = messages[index];
  document.querySelector('.letter-container').innerHTML = `
    <div class="letter">
      <h1 id="letter-title">${letter.title}</h1>
      <p id="letter-content">${letter.content}</p>
      <p id="letter-signature">${letter.signature}</p>
    </div>
    <button id="next-letter">Next Letter ❤️</button>
  `;
  
  document.getElementById('next-letter').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % messages.length;
    displayLetter(currentIndex);
  });
}

// Secret reset function
function resetWebsite(e) {
  if (e.ctrlKey && e.altKey && e.key === 'r') {
    localStorage.clear();
    window.location.reload();
  }
}

document.addEventListener('keydown', resetWebsite);

document.addEventListener('DOMContentLoaded', () => {
  if (!checkValentinesStatus()) return;
  
  hasSelectedYes = localStorage.getItem('hasSelectedYes') === 'true';
  
  if (hasSelectedYes) {
    if (isValentinesDay()) {
      loadMessages();
    } else {
      document.querySelector('.letter-container').innerHTML = `
        <img src="valentines.gif" alt="Valentine's Day" style="max-width: 300px; margin-bottom: 20px;">
        <h1>Thank you for saying Yes my love! You can't open the letter until Valentine's Day but for now I'm happy to give you all the love I can in our messages! We'll be together soon ❤️ </h1>
      `;
    }
  } else {
    showInitialPrompt();
  }
});
