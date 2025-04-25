// Update simulator behavior
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
}

// Example usage
updateSimulatorBehavior(2, 5, 3);