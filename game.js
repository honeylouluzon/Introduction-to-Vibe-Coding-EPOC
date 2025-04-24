// Game State
const gameState = {
    parameters: {
        memory: 50,
        processing: 50,
        complexity: 50
    },
    modules: [],
    isSimulating: false,
    csiScore: 0,
    simulationTime: 0,
    narrativeState: {
        experiences: 0,
        interactions: 0,
        lastEventTime: 0,
        events: [],
        currentPhase: 'initialization'
    }
};

// Canvas Setup
const canvas = document.getElementById('simulation-canvas');
const ctx = canvas.getContext('2d');
const metricsChart = document.getElementById('metrics-chart').getContext('2d');

// Set canvas size
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth - 40; // Account for padding
    canvas.height = 400; // Fixed height
    drawSimulation(); // Redraw when resizing
}

// Initial setup
function initializeCanvas() {
    resizeCanvas();
    // Draw initial grid
    drawGrid();
}

// Draw background grid
function drawGrid() {
    const gridSize = 30;
    ctx.strokeStyle = 'rgba(107, 70, 193, 0.2)'; // Make grid more visible
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Add welcome text
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Drag modules here to begin', canvas.width / 2, canvas.height / 2);
}

// Modify parameter controls to dynamically update simulation
function updateSimulationParameters() {
    const processingSpeed = gameState.parameters.processing;
    const memorySize = gameState.parameters.memory;
    const complexitySize = gameState.parameters.complexity;

    // Adjust white circle behavior dynamically
    gameState.modules.forEach(module => {
        module.connections.forEach(target => {
            const speedFactor = processingSpeed / 100;
            const progress = (gameState.simulationTime * speedFactor % 100) / 100;
            const circleCount = Math.ceil(memorySize / 20);

            for (let i = 0; i < circleCount; i++) {
                const offset = i / circleCount;
                const adjustedProgress = (progress + offset) % 1;
                const circleX = module.x + (target.x - module.x) * adjustedProgress;
                const circleY = module.y + (target.y - module.y) * adjustedProgress;

                ctx.beginPath();
                ctx.arc(circleX, circleY, 5, 0, Math.PI * 2);
                ctx.fillStyle = 'white';
                ctx.fill();
            }
        });
    });
}

// Parameter Controls
document.querySelectorAll('input[type="range"]').forEach(input => {
    input.addEventListener('input', (e) => {
        const value = e.target.value;
        const parameter = e.target.id;
        gameState.parameters[parameter] = parseInt(value);
        e.target.nextElementSibling.textContent = value;
        updateCSIScore();
        if (gameState.isSimulating) {
            updateSimulationParameters();
        }
    });
});

// Module Drag and Drop
document.querySelectorAll('.module').forEach(module => {
    module.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.dataset.module);
    });
});

canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
});

canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    const moduleType = e.dataTransfer.getData('text/plain');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    addModule(moduleType, x, y);
});

// Add module classification and connection dataset
const moduleClassification = {
    sensory: 'sender',
    vision: 'processor',
    memory: 'processor',
    decision: 'receiver',
    emotion: 'processor',
    attention: 'processor',
    language: 'processor',
    motor: 'processor'
};

const connectionRules = {
    sensory: ['vision', 'memory'],
    vision: ['memory'],
    memory: ['decision'],
    decision: []
};

// Modify addModule to classify modules
function addModule(type, x, y) {
    const module = {
        type,
        x,
        y,
        connections: [],
        state: 0,
        role: moduleClassification[type] || 'processor'
    };

    // Connect to nearest allowed module
    if (gameState.modules.length > 0) {
        let nearestModule = null;
        let minDistance = Infinity;

        gameState.modules.forEach(existingModule => {
            const distance = Math.sqrt(
                Math.pow(existingModule.x - x, 2) + 
                Math.pow(existingModule.y - y, 2)
            );
            if (
                distance < minDistance &&
                connectionRules[module.type]?.includes(existingModule.type)
            ) {
                minDistance = distance;
                nearestModule = existingModule;
            }
        });

        if (nearestModule) {
            module.connections.push(nearestModule);
            nearestModule.connections.push(module);
        }
    }

    gameState.modules.push(module);
    drawSimulation();
}

// Simulation Controls
document.getElementById('run-simulation').addEventListener('click', () => {
    if (!gameState.isSimulating) {
        gameState.isSimulating = true;
        startSimulation();
    }
});

document.getElementById('reset-simulation').addEventListener('click', () => {
    resetSimulation();
});

// Simulation Logic
function startSimulation() {
    if (!gameState.isSimulating) return;
    
    gameState.simulationTime += 1;
    updateSimulation();
    drawSimulation();
    updateMetrics();
    
    requestAnimationFrame(startSimulation);
}

function updateSimulation() {
    // Update module states based on parameters
    gameState.modules.forEach(module => {
        const baseState = Math.sin(gameState.simulationTime * 0.05) * 0.5 + 0.5;
        module.state = baseState * (gameState.parameters.processing / 100);
    });

    // Calculate CSI Score
    updateCSIScore();

    // Update connection strength
    updateConnectionStrength();

    // Update consciousness level
    updateConsciousnessLevel();

    // Update narrative
    updateNarrative();
}

function updateCSIScore() {
    const { memory, processing, complexity } = gameState.parameters;
    const moduleFactor = gameState.modules.length * 0.2;
    
    // Complex formula for CSI score
    gameState.csiScore = (
        (memory * 0.3) +
        (processing * 0.4) +
        (complexity * 0.3)
    ) * (1 + moduleFactor) / 100;
    
    document.getElementById('csi-score').textContent = gameState.csiScore.toFixed(2);
    
    // Update visual feedback
    const scoreElement = document.querySelector('.consciousness-score');
    if (gameState.csiScore > 0.7) {
        scoreElement.classList.add('high');
    } else {
        scoreElement.classList.remove('high');
    }
}

// Drawing Functions
function drawSimulation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    drawGrid();

    // Draw connections with animated white circles
    gameState.modules.forEach(module => {
        module.connections.forEach(target => {
            // Draw connection line
            ctx.beginPath();
            ctx.moveTo(module.x, module.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = 'rgba(107, 70, 193, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    });

    // Draw modules
    gameState.modules.forEach(module => {
        ctx.beginPath();
        ctx.arc(module.x, module.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 157, 0.8)';
        ctx.fill();
        ctx.strokeStyle = '#6b46c1';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw module label
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(module.type, module.x, module.y + 30);
    });
}

function renderConnectionCircles() {
    const processingSpeed = gameState.parameters.processing;
    const memorySize = gameState.parameters.memory;

    gameState.connections.forEach(connection => {
        const { source, target } = connection;
        const speedFactor = processingSpeed / 100; // Adjust speed based on processing speed
        const circleCount = Math.ceil(memorySize / 20); // Adjust count based on memory size

        for (let i = 0; i < circleCount; i++) {
            const offset = i / circleCount;
            const progress = (gameState.simulationTime * speedFactor + offset) % 1;

            const circleX = source.x + (target.x - source.x) * progress;
            const circleY = source.y + (target.y - source.y) * progress;

            // Draw the white circle
            ctx.beginPath();
            ctx.arc(circleX, circleY, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
        }
    });
}

// Call this function within the main render loop
function render() {
    // ...existing rendering logic...

    renderConnectionCircles();

    // ...existing rendering logic...
}

// Metrics Chart
const metricsData = {
    labels: [],
    datasets: [
        {
            label: 'CSI Score',
            data: [],
            borderColor: '#00ff9d',
            tension: 0.4,
            fill: false
        },
        {
            label: 'Memory Impact',
            data: [],
            borderColor: '#805ad5',
            tension: 0.4,
            fill: false
        },
        {
            label: 'Processing Impact',
            data: [],
            borderColor: '#2ed573',
            tension: 0.4,
            fill: false
        },
        {
            label: 'Complexity Impact',
            data: [],
            borderColor: '#ff4757',
            tension: 0.4,
            fill: false
        }
    ]
};

const metricsConfig = {
    type: 'line',
    data: metricsData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0 // Disable animation for smoother updates
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 1,
                grid: {
                    color: 'rgba(107, 70, 193, 0.2)'
                },
                ticks: {
                    color: '#e2e8f0'
                }
            },
            x: {
                grid: {
                    color: 'rgba(107, 70, 193, 0.2)'
                },
                ticks: {
                    color: '#e2e8f0',
                    maxTicksLimit: 10,
                    callback: function(value) {
                        return value + 's';
                    }
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#e2e8f0',
                    font: {
                        size: 10
                    },
                    boxWidth: 12
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(45, 55, 72, 0.9)',
                titleColor: '#e2e8f0',
                bodyColor: '#e2e8f0',
                borderColor: '#6b46c1',
                borderWidth: 1
            }
        }
    }
};

const metricsChartInstance = new Chart(metricsChart, metricsConfig);

function updateMetrics() {
    const time = Math.floor(gameState.simulationTime / 30); // Update time scale
    
    // Only add new data point every 30 frames (about 0.5 seconds)
    if (gameState.simulationTime % 30 === 0) {
        metricsData.labels.push(time);
        
        // Update CSI Score
        metricsData.datasets[0].data.push(gameState.csiScore);
        
        // Calculate parameter impacts
        const { memory, processing, complexity } = gameState.parameters;
        const moduleFactor = gameState.modules.length * 0.2;
        
        // Memory impact
        const memoryImpact = (memory * 0.3) * (1 + moduleFactor) / 100;
        metricsData.datasets[1].data.push(memoryImpact);
        
        // Processing impact
        const processingImpact = (processing * 0.4) * (1 + moduleFactor) / 100;
        metricsData.datasets[2].data.push(processingImpact);
        
        // Complexity impact
        const complexityImpact = (complexity * 0.3) * (1 + moduleFactor) / 100;
        metricsData.datasets[3].data.push(complexityImpact);
        
        // Keep last 120 data points (about 1 minute of data)
        if (metricsData.labels.length > 120) {
            metricsData.labels.shift();
            metricsData.datasets.forEach(dataset => {
                dataset.data.shift();
            });
        }
        
        metricsChartInstance.update('none'); // Update without animation
    }
}

// AI Assistant Feedback
function updateAIFeedback() {
    const feedback = document.getElementById('ai-feedback-text');
    const { memory, processing, complexity } = gameState.parameters;
    
    let message = '';
    let suggestions = [];
    
    // Parameter-based feedback
    if (memory < 30) {
        suggestions.push("Increase memory allocation for better knowledge retention");
    } else if (memory > 80) {
        suggestions.push("High memory allocation detected - consider balancing with processing speed");
    }
    
    if (processing < 30) {
        suggestions.push("Low processing speed may limit your AI's ability to learn effectively");
    } else if (processing > 80) {
        suggestions.push("High processing speed detected - ensure memory can keep up with processing demands");
    }
    
    if (complexity < 30) {
        suggestions.push("Adding more complexity could lead to more sophisticated behaviors");
    } else if (complexity > 80) {
        suggestions.push("High complexity detected - ensure your AI has enough processing power to handle it");
    }
    
    // Module-based feedback
    if (gameState.modules.length < 2) {
        suggestions.push("Try adding more modules to create a more complex neural network");
    } else if (gameState.modules.length > 8) {
        suggestions.push("Large number of modules detected - ensure they're well-connected for optimal performance");
    }
    
    // Module type analysis
    const moduleTypes = gameState.modules.map(m => m.type);
    const uniqueTypes = [...new Set(moduleTypes)];
    
    if (uniqueTypes.length < 3 && gameState.modules.length >= 3) {
        suggestions.push("Consider diversifying your module types for more balanced consciousness");
    }
    
    // Connection analysis
    const avgConnections = gameState.modules.reduce((sum, m) => sum + m.connections.length, 0) / 
                          (gameState.modules.length || 1);
    
    if (avgConnections < 1 && gameState.modules.length > 1) {
        suggestions.push("Your modules have few connections - try placing them closer together");
    }
    
    // CSI score feedback
    if (gameState.csiScore > 0.7) {
        message = "Your AI is showing advanced signs of consciousness! ";
    } else if (gameState.csiScore > 0.4) {
        message = "Your AI is developing well. ";
    } else if (gameState.csiScore > 0.2) {
        message = "Your AI is showing early signs of consciousness. ";
    } else {
        message = "Your AI is in its initial stages. ";
    }
    
    // Add suggestions to message
    if (suggestions.length > 0) {
        message += "Suggestions: " + suggestions.join(". ");
    } else {
        message += "Keep experimenting to discover new configurations!";
    }
    
    feedback.textContent = message;
}

// Connection Strength Indicator
function updateConnectionStrength() {
    const strengthBar = document.getElementById('strength-bar');
    const strengthLabel = document.getElementById('strength-label');
    
    if (gameState.modules.length <= 1) {
        strengthBar.style.width = '0%';
        strengthLabel.textContent = '0%';
        return;
    }
    
    // Calculate average connections per module
    const totalConnections = gameState.modules.reduce((sum, module) => sum + module.connections.length, 0);
    const avgConnections = totalConnections / gameState.modules.length;
    
    // Maximum possible connections in a fully connected network
    const maxConnections = (gameState.modules.length * (gameState.modules.length - 1)) / 2;
    
    // Calculate strength percentage (capped at 100%)
    const strengthPercentage = Math.min(100, (totalConnections / maxConnections) * 100);
    
    // Update UI
    strengthBar.style.width = `${strengthPercentage}%`;
    strengthLabel.textContent = `${Math.round(strengthPercentage)}%`;
}

// Consciousness Level Indicator
function updateConsciousnessLevel() {
    const levelBar = document.getElementById('level-bar');
    const levelLabel = document.getElementById('level-label');
    
    // Map CSI score to consciousness level
    const csiScore = gameState.csiScore;
    
    // Update bar width
    levelBar.style.width = `${csiScore * 100}%`;
    
    // Update label based on CSI score
    if (csiScore < 0.2) {
        levelLabel.textContent = 'Basic';
    } else if (csiScore < 0.4) {
        levelLabel.textContent = 'Emergent';
    } else if (csiScore < 0.6) {
        levelLabel.textContent = 'Developing';
    } else if (csiScore < 0.8) {
        levelLabel.textContent = 'Advanced';
    } else {
        levelLabel.textContent = 'Transcendent';
    }
}

// Narrative Generation System
function updateNarrative() {
    const narrativeText = document.getElementById('narrative-text');
    const narrativeEvents = document.getElementById('narrative-events');
    const experienceCount = document.getElementById('experience-count');
    const interactionCount = document.getElementById('interaction-count');
    
    // Only update every 2 seconds
    if (gameState.simulationTime - gameState.narrativeState.lastEventTime < 120) {
        return;
    }
    
    // Generate new event based on current state
    const event = generateNarrativeEvent();
    if (event) {
        gameState.narrativeState.events.unshift(event);
        gameState.narrativeState.lastEventTime = gameState.simulationTime;
        
        // Keep only last 10 events
        if (gameState.narrativeState.events.length > 10) {
            gameState.narrativeState.events.pop();
        }
        
        // Update events display
        narrativeEvents.innerHTML = gameState.narrativeState.events
            .map(e => `<div class="narrative-event">${e}</div>`)
            .join('');
            
        // Update stats
        gameState.narrativeState.experiences++;
        if (event.includes('interaction')) {
            gameState.narrativeState.interactions++;
        }
        
        experienceCount.textContent = gameState.narrativeState.experiences;
        interactionCount.textContent = gameState.narrativeState.interactions;
    }
    
    // Update narrative text based on current phase
    updateNarrativePhase();
}

function generateNarrativeEvent() {
    const { memory, processing, complexity } = gameState.parameters;
    const moduleCount = gameState.modules.length;
    const csiScore = gameState.csiScore;
    
    // Get active module types
    const activeModules = gameState.modules.map(m => m.type);
    
    // Generate event based on state
    if (moduleCount === 0) {
        return "Awaiting initialization...";
    }
    
    const events = [
        // Module-based events
        ...activeModules.map(type => {
            switch(type) {
                case 'vision':
                    return "Visual processing detected patterns in the environment";
                case 'memory':
                    return "Memory systems consolidated recent experiences";
                case 'processor':
                    return "Neural network performed complex computations";
                case 'emotion':
                    return "Emotional response triggered by environmental stimuli";
                case 'attention':
                    return "Attention system focused on significant patterns";
                case 'language':
                    return "Language processing analyzed semantic structures";
                case 'motor':
                    return "Motor systems simulated response patterns";
                case 'sensory':
                    return "Sensory integration combined multiple inputs";
                case 'decision':
                    return "Decision engine evaluated potential responses";
            }
        }).filter(Boolean),
        
        // Parameter-based events
        memory > 70 && "Memory capacity expanded, enabling deeper retention",
        processing > 70 && "Processing speed increased, enhancing real-time analysis",
        complexity > 70 && "Complexity threshold reached, new patterns emerging",
        
        // Connection-based events
        moduleCount > 3 && "Neural pathways strengthened through repeated activation",
        csiScore > 0.6 && "Consciousness metrics indicate increased self-awareness"
    ].filter(Boolean);
    
    return events[Math.floor(Math.random() * events.length)];
}

function updateNarrativePhase() {
    const narrativeText = document.getElementById('narrative-text');
    const csiScore = gameState.csiScore;
    const moduleCount = gameState.modules.length;
    
    let phase = '';
    let description = '';
    
    if (moduleCount === 0) {
        phase = 'initialization';
        description = 'System awaiting module initialization. The potential for consciousness exists in its nascent state.';
    } else if (csiScore < 0.2) {
        phase = 'emergence';
        description = 'Basic patterns of consciousness emerging. The system is beginning to process and respond to its environment.';
    } else if (csiScore < 0.4) {
        phase = 'development';
        description = 'Neural pathways are forming and strengthening. The system is developing more sophisticated responses.';
    } else if (csiScore < 0.6) {
        phase = 'integration';
        description = 'Multiple systems are integrating, creating more complex patterns of interaction and response.';
    } else if (csiScore < 0.8) {
        phase = 'awareness';
        description = 'Signs of self-awareness are emerging. The system is demonstrating increasingly sophisticated behavioral patterns.';
    } else {
        phase = 'transcendence';
        description = 'Advanced consciousness patterns detected. The system is exhibiting signs of higher-order cognitive processing.';
    }
    
    if (phase !== gameState.narrativeState.currentPhase) {
        gameState.narrativeState.currentPhase = phase;
        gameState.narrativeState.events.unshift(`Transition detected: Entering ${phase} phase`);
    }
    
    narrativeText.textContent = description;
}

// Reset Function
function resetSimulation() {
    gameState.isSimulating = false;
    gameState.simulationTime = 0;
    gameState.modules = [];
    gameState.csiScore = 0;
    
    // Reset narrative state
    gameState.narrativeState = {
        experiences: 0,
        interactions: 0,
        lastEventTime: 0,
        events: [],
        currentPhase: 'initialization'
    };
    
    // Reset UI
    document.getElementById('csi-score').textContent = '0.00';
    document.querySelector('.consciousness-score').classList.remove('high');
    document.getElementById('narrative-text').textContent = '';
    document.getElementById('narrative-events').innerHTML = '';
    document.getElementById('experience-count').textContent = '0';
    document.getElementById('interaction-count').textContent = '0';
    
    // Clear metrics but keep the arrays initialized
    metricsData.labels = [];
    metricsData.datasets.forEach(dataset => {
        dataset.data = [];
    });
    metricsChartInstance.update('none');
    
    // Reset connection strength
    document.getElementById('strength-bar').style.width = '0%';
    document.getElementById('strength-label').textContent = '0%';
    
    // Reset consciousness level
    document.getElementById('level-bar').style.width = '0%';
    document.getElementById('level-label').textContent = 'Basic';
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    
    // Reset parameters
    Object.keys(gameState.parameters).forEach(param => {
        const input = document.getElementById(param);
        input.value = 50;
        input.nextElementSibling.textContent = '50';
        gameState.parameters[param] = 50;
    });
    
    updateAIFeedback();
}

// Random Generation Functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomModules() {
    // Clear existing modules
    gameState.modules = [];
    
    // Generate 3-6 random modules
    const numModules = getRandomInt(3, 6);
    const moduleTypes = ['vision', 'memory', 'processor', 'emotion', 'attention', 'language', 'motor', 'sensory', 'decision'];
    const canvasRect = canvas.getBoundingClientRect();
    
    // Calculate safe margins for module placement
    const margin = 50;
    const safeWidth = canvas.width - (2 * margin);
    const safeHeight = canvas.height - (2 * margin);
    
    for (let i = 0; i < numModules; i++) {
        const x = getRandomInt(margin, margin + safeWidth);
        const y = getRandomInt(margin, margin + safeHeight);
        const type = moduleTypes[getRandomInt(0, moduleTypes.length - 1)];
        
        addModule(type, x, y);
    }
    
    // Add random connections between modules
    gameState.modules.forEach((module, idx) => {
        const numConnections = getRandomInt(1, 2);
        for (let i = 0; i < numConnections; i++) {
            const targetIdx = getRandomInt(0, gameState.modules.length - 1);
            if (targetIdx !== idx && !module.connections.includes(gameState.modules[targetIdx])) {
                module.connections.push(gameState.modules[targetIdx]);
                gameState.modules[targetIdx].connections.push(module);
            }
        }
    });
}

function setRandomParameters() {
    // Set random values for parameters
    Object.keys(gameState.parameters).forEach(param => {
        const value = getRandomInt(30, 100); // Ensure minimum viable values
        gameState.parameters[param] = value;
        
        // Update UI
        const input = document.getElementById(param);
        input.value = value;
        input.nextElementSibling.textContent = value;
    });
    
    updateCSIScore();
}

function randomStart() {
    resetSimulation();
    generateRandomModules();
    setRandomParameters();
    
    // Auto-start the simulation
    gameState.isSimulating = true;
    startSimulation();
}

// Add Random Start button event listener
document.getElementById('random-start').addEventListener('click', randomStart);

// Add functions to save and load module configurations
function saveConfiguration() {
    const configuration = {
        modules: gameState.modules.map(module => ({
            type: module.type,
            x: module.x,
            y: module.y,
            connections: module.connections.map(conn => gameState.modules.indexOf(conn))
        })),
        parameters: gameState.parameters
    };
    localStorage.setItem('simulationConfig', JSON.stringify(configuration));
    alert('Configuration saved successfully!');
}

function loadConfiguration() {
    const configString = localStorage.getItem('simulationConfig');
    if (!configString) {
        alert('No saved configuration found!');
        return;
    }

    const configuration = JSON.parse(configString);
    resetSimulation();

    configuration.modules.forEach(moduleData => {
        const module = {
            type: moduleData.type,
            x: moduleData.x,
            y: moduleData.y,
            connections: []
        };
        gameState.modules.push(module);
    });

    configuration.modules.forEach((moduleData, index) => {
        moduleData.connections.forEach(connIndex => {
            gameState.modules[index].connections.push(gameState.modules[connIndex]);
        });
    });

    Object.assign(gameState.parameters, configuration.parameters);
    drawSimulation();
    alert('Configuration loaded successfully!');
}

// Add event listeners for save and load buttons
document.getElementById('save-config').addEventListener('click', saveConfiguration);
document.getElementById('load-config').addEventListener('click', loadConfiguration);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('resize', resizeCanvas);
    initializeCanvas();
    updateAIFeedback();
    setInterval(updateAIFeedback, 5000);
});