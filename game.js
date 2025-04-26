// Update simulator behavior dynamically based on slider changes
function updateSimulatorBehavior(processingSpeed, memorySize, complexity) {
    const whiteCircles = document.querySelectorAll('.white-circle');
    whiteCircles.forEach(circle => {
        circle.style.animationDuration = `${2 / processingSpeed}s`;
    });

    const connectionLines = document.querySelectorAll('.connection-line');
    connectionLines.forEach(line => {
        line.style.setProperty('--circle-count', memorySize);
    });

    const modules = document.querySelectorAll('.module');
    modules.forEach(module => {
        module.dataset.complexity = complexity;
    });

    // Adjust connections based on complexity
    const allModules = document.querySelectorAll('.module');
    allModules.forEach(module => {
        const connections = Math.min(complexity, allModules.length - 1);
        module.dataset.connections = connections;
    });
}

// Example usage
updateSimulatorBehavior(2, 5, 3);

// Update simulator behavior dynamically based on slider changes
document.getElementById('memory').addEventListener('input', (event) => {
    const memorySize = event.target.value;
    updateSimulatorBehavior(
        document.getElementById('processing').value,
        memorySize,
        document.getElementById('complexity').value
    );
});

document.getElementById('processing').addEventListener('input', (event) => {
    const processingSpeed = event.target.value;
    updateSimulatorBehavior(
        processingSpeed,
        document.getElementById('memory').value,
        document.getElementById('complexity').value
    );
});

document.getElementById('complexity').addEventListener('input', (event) => {
    const complexity = event.target.value;
    updateSimulatorBehavior(
        document.getElementById('processing').value,
        document.getElementById('memory').value,
        complexity
    );
});