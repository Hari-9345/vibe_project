/* Prism Dashboard - Business Logic */

document.addEventListener('DOMContentLoaded', () => {
    // === Core State ===
    let timeLeft = 25 * 60;
    let timerID = null;
    let isPaused = true;
    const taskInput = document.getElementById('task-input');
    const tasksList = document.getElementById('tasks-list');
    const timerDisplay = document.getElementById('timer-display');
    const timerProgress = document.getElementById('timer-progress');
    const circumference = 2 * Math.PI * 110;

    // === Quotes Logic ===
    const quotes = [
        { text: "Simple is the ultimate sophistication.", author: "Leonardo da Vinci" },
        { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
        { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
        { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" },
        { text: "The details are not the details. They make the design.", author: "Charles Eames" }
    ];

    function rotateQuote() {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        document.getElementById('quote-text').innerText = quote.text;
        document.getElementById('quote-author').innerText = `— ${quote.author}`;
    }

    // === Timer Logic ===

    function updateTimerUI() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update circle progress
        const offset = circumference - (timeLeft / (25 * 60)) * circumference;
        timerProgress.style.strokeDashoffset = offset;
    }

    function toggleTimer() {
        const startBtn = document.getElementById('start-btn');
        if (isPaused) {
            isPaused = false;
            startBtn.innerText = 'Pause';
            timerID = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerUI();
                } else {
                    clearInterval(timerID);
                    alert("Focus session complete! Take a break.");
                    resetTimer();
                }
            }, 1000);
        } else {
            isPaused = true;
            startBtn.innerText = 'Resume';
            clearInterval(timerID);
        }
    }

    function resetTimer() {
        clearInterval(timerID);
        timeLeft = 25 * 60;
        isPaused = true;
        document.getElementById('start-btn').innerText = 'Start';
        updateTimerUI();
    }

    // === Task Logic ===

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(item => {
            const taskTextElement = item.querySelector('.task-text');
            if (taskTextElement) {
                tasks.push({
                    text: taskTextElement.innerText,
                    completed: item.classList.contains('completed')
                });
            }
        });
        localStorage.setItem('prism_tasks', JSON.stringify(tasks));
    }

    function renderTask(text, completed = false) {
        const item = document.createElement('div');
        item.className = `task-item ${completed ? 'completed' : ''}`;
        item.innerHTML = `
            <div class="task-check"></div>
            <span class="task-text">${text}</span>
            <button class="task-delete">&times;</button>
        `;
        
        const check = item.querySelector('.task-check');
        const deleteBtn = item.querySelector('.task-delete');

        check.addEventListener('click', (e) => {
            item.classList.toggle('completed');
            saveTasks();
        });

        deleteBtn.addEventListener('click', (e) => {
            item.classList.add('removing');
            setTimeout(() => {
                item.remove();
                saveTasks();
            }, 300);
        });

        tasksList.appendChild(item);
    }

    function loadTasks() {
        const stored = JSON.parse(localStorage.getItem('prism_tasks') || '[]');
        stored.forEach(task => renderTask(task.text, task.completed));
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            renderTask(text);
            taskInput.value = '';
            saveTasks();
        }
    }

    // === Event Listeners ===
    document.getElementById('start-btn').addEventListener('click', toggleTimer);
    document.getElementById('reset-btn').addEventListener('click', resetTimer);
    document.getElementById('add-task-btn').addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // === Initialization ===
    // Set circle properties first
    timerProgress.style.strokeDasharray = circumference;
    
    // Then load state and update UI
    rotateQuote();
    loadTasks();
    updateTimerUI();
    
    // Add a check for LocalStorage availability
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
    } catch (e) {
        console.warn("LocalStorage is not available. Your tasks will not be saved across sessions. This often happens when opening local files directly in some browsers.");
    }
});
