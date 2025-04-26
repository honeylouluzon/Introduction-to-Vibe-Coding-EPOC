// Update simulator behavior dynamically based on slider changes
function updateSimulatorBehavior(processingSpeed, memorySize, complexity) {
    const whiteCircles = document.querySelectorAll('.white-circle');
    // Adjust white circle speed based on processing speed
    whiteCircles.forEach(circle => {
        circle.style.animationDuration = `${2 / processingSpeed}s`;
    });

    const connectionLines = document.querySelectorAll('.connection-line');
    // Adjust circle count based on memory size
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
['memory', 'processing', 'complexity'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        updateSimulatorBehavior(
            document.getElementById('processing').value,
            document.getElementById('memory').value,
            document.getElementById('complexity').value
        );
    });
});

// Add event listener for module click to show pop-up
const modules = document.querySelectorAll('.module');
modules.forEach(module => {
    module.addEventListener('click', () => {
        const popup = document.createElement('div');
        popup.className = 'module-popup';
        popup.textContent = `Definition and function of ${module.dataset.module}`;
        document.body.appendChild(popup);

        // Close popup on click
        popup.addEventListener('click', () => {
            popup.remove();
        });
    });
});

// Modify modules to recognize their roles
modules.forEach(module => {
    if (module.dataset.module === 'vision' || module.dataset.module === 'sensory') {
        module.dataset.role = 'signal sender';
    } else if (module.dataset.module === 'processor' || module.dataset.module === 'neural') {
        module.dataset.role = 'processor';
    } else {
        module.dataset.role = 'receiver';
    }
});