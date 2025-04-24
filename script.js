    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const resultEl = document.getElementById('result');
    const aiResultEl = document.getElementById('ai-result');
    const historyEl = document.getElementById('history');
    const tickSound = document.getElementById('tickSound');

    const numbers = [
      0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23,
      10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
    ];

    const colors = numbers.map(n => n === 0 ? 'green' : (numbers.indexOf(n) % 2 === 0 ? 'black' : 'red'));
    const anglePerSegment = 2 * Math.PI / numbers.length;

    let spinHistory = [];

    function drawWheel(rotation = 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const radius = canvas.width / 2;

      for (let i = 0; i < numbers.length; i++) {
        const startAngle = i * anglePerSegment + rotation;
        const endAngle = startAngle + anglePerSegment;

        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, startAngle, endAngle);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.stroke();

        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 12px Comic Sans MS";
        ctx.fillText(numbers[i], radius - 10, 5);
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(radius, radius, 18, 0, 2 * Math.PI);
      ctx.fillStyle = "#333";
      ctx.fill();
    }

    let currentRotation = 0;

    function spinPlayer() {
      resultEl.textContent = "";
      const spins = 6 + Math.floor(Math.random() * 4);
      const randomStop = Math.random() * 2 * Math.PI;
      const totalRotation = spins * 2 * Math.PI + randomStop;

      const duration = 3000;
      const start = performance.now();
      let tickAngle = 0;

      function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        currentRotation = totalRotation * eased;
        drawWheel(currentRotation);

        const currentAngle = currentRotation % (2 * Math.PI);
        if (currentAngle - tickAngle > anglePerSegment) {
          tickAngle = currentAngle;
          tickSound.currentTime = 0;
          tickSound.play();
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          const index = Math.floor((numbers.length - (currentRotation % (2 * Math.PI)) / anglePerSegment)) % numbers.length;
          const resultNumber = numbers[index];
          const resultColor = colors[index];
          resultEl.textContent = `Դուք հաղթեցիք՝ ${resultNumber} (${resultColor})`;
          addHistory(resultNumber, resultColor);
        }
      }

      requestAnimationFrame(animate);
    }

    function spinAI() {
      aiResultEl.textContent = "";
      const spins = 6 + Math.floor(Math.random() * 4);
      const randomStop = Math.random() * 2 * Math.PI;
      const totalRotation = spins * 2 * Math.PI + randomStop;

      const duration = 3000;
      const start = performance.now();
      let tickAngle = 0;

      function animateAI(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        currentRotation = totalRotation * eased;
        drawWheel(currentRotation);

        const currentAngle = currentRotation % (2 * Math.PI);
        if (currentAngle - tickAngle > anglePerSegment) {
          tickAngle = currentAngle;
          tickSound.currentTime = 0;
          tickSound.play();
        }

        if (progress < 1) {
          requestAnimationFrame(animateAI);
        } else {
          const index = Math.floor((numbers.length - (currentRotation % (2 * Math.PI)) / anglePerSegment)) % numbers.length;
          const resultNumber = numbers[index];
          const resultColor = colors[index];
          aiResultEl.textContent = `Ռոբոտի արդյունքը՝ ${resultNumber} (${resultColor})`;
          addHistory(resultNumber, resultColor);
          compareResults(resultNumber, resultColor);
        }
      }

      requestAnimationFrame(animateAI);
    }

    function addHistory(number, color) {
      const historyItem = document.createElement('div');
      historyItem.classList.add('history-item');
      historyItem.textContent = `${number} (${color})`;
      spinHistory.unshift(historyItem);
      if (spinHistory.length > 5) {
        historyEl.removeChild(spinHistory.pop());
      }
      historyEl.insertBefore(historyItem, historyEl.firstChild);
    }


    
    function compareResults(playerNumber, playerColor) {
      const aiNumber = numbers[Math.floor(Math.random() * numbers.length)];
      const aiColor = colors[numbers.indexOf(aiNumber)];
      if (playerNumber === aiNumber) {
        alert("Դուք և ռոբոտը համատեղ հաղթեցինք!");
      } else if (playerNumber > aiNumber) {
        alert("Դուք հաղթեցիք ռոբոտին!");
      } else {
        alert("Ռոբոտը հաղթեց Ձեզ!");
      }
    }
    function startTimer() {
      let timeLeft = 10; // 10 վայրկյան
      const timer = setInterval(function() {
        timeLeft--;
        if (timeLeft <= 0) {
          clearInterval(timer);
          alert("Հավես ժամանակը վերջացավ!");
        }
      }, 1000);
    }
    drawWheel();

