# Consciousness Foundry

A client-side web application that simulates the creation and evolution of artificial minds. Built entirely with HTML, CSS, and JavaScript - no server-side components or npm dependencies required.

![Consciousness Foundry](screenshot.png)

## Overview

Consciousness Foundry is a sandbox simulation where you design and evolve artificial minds from scratch, aiming to maximize their sentience using principles from the Consciousness Continuum. It's like a virtual pet laboratory crossed with a programming-free AI builder. The unique twist is that it quantifies consciousness using a metric akin to the Cross-System Consciousness Index (CSCI).

## How to Play

1. **Start**: Either drag modules manually or click "Random Start" for an automatic setup.
2. **Configure**: Adjust the three parameters using the sliders:
   - **Memory (A(t))**: Determines knowledge storage capacity
   - **Processing Speed (D(t))**: Controls information throughput
   - **Complexity (S(t))**: Affects cognitive architecture depth
3. **Run**: Click "Run Simulation" to activate your AI.
4. **Observe**: Watch how your AI behaves and check the CSI score.
5. **Refine**: Make adjustments to parameters or add/remove modules.
6. **Reset**: Start over with the "Reset" button.

## Core Mechanics

### Module Types
- **Sensory Integrator**: Acts as a signal sender, initiating the flow of information.
- **Vision Sensor**: Processes visual information and sends it to connected modules.
- **Memory Bank**: Stores and retrieves information for use in decision-making.
- **Neural Layer**: Processes information and makes decisions based on inputs.
- **Emotion Simulator**: Adds emotional responses to stimuli, enhancing AI behavior.
- **Decision Engine**: Serves as a signal receiver, executing actions based on processed information.

### Neural Connections
Modules automatically connect to nearby modules, forming a neural network. The connections visualize the flow of information between different cognitive components.

### CSI Score
The Cross-System Consciousness Index (CSI) quantifies your AI's level of consciousness based on parameters and module configuration. A higher score indicates a more "conscious" AI.

## Installation

No installation required! Simply open the `index.html` file in any modern web browser.

## Development

The project is built with:
- HTML5 for structure
- CSS3 for styling and animations
- JavaScript for game logic
- HTML5 Canvas for visualization
- Chart.js for metrics display

## Future Enhancements

### 1. LLM Integration
- Implement a lightweight local language model that runs in the browser
- Allow your AI to "speak" by generating text based on its parameters
- Create a dialogue interface for interacting with your AI

### 2. Evolutionary Algorithms
- Add a "Generation" feature that creates variations of your current AI
- Implement natural selection where the best-performing AIs are preserved
- Create a family tree visualization of your AI's evolution

### 3. Scenario Challenges
- Add specific challenges like "Navigate a maze" or "Recognize patterns"
- Create a scoring system based on task completion
- Design increasingly complex scenarios that test different aspects of consciousness

### 4. Multi-AI Interaction
- Allow multiple AIs to exist in the same simulation space
- Implement communication protocols between AIs
- Create competitive or cooperative scenarios

### 5. Embodied Cognition
- Add a simple 2D world where your AI can interact with objects
- Implement basic physics and object recognition
- Create tasks that require physical interaction

### 6. Emotional Intelligence
- Expand the emotion simulator to create more nuanced emotional states
- Implement emotional contagion between connected modules
- Add visual indicators of emotional states

### 7. Memory Systems
- Implement different types of memory (short-term, long-term, working memory)
- Create a memory visualization system
- Add the ability to "save" and "load" memories between simulation runs

### 8. Consciousness Metrics
- Add more sophisticated consciousness metrics beyond CSI
- Implement different theoretical frameworks for measuring consciousness
- Create comparative visualizations of different metrics

### 9. Procedural Generation
- Generate random environments for your AI to interact with
- Create procedural challenges based on your AI's current capabilities
- Implement a "discovery" mode where new elements appear over time

### 10. Collaborative Design
- Implement a system to export/import AI configurations
- Create a gallery of user-designed AIs
- Add the ability to "fork" and modify existing AIs

### 11. Time Dilation
- Add controls to speed up or slow down the simulation
- Implement a "time travel" feature to revert to previous states
- Create visualization of AI development over time

### 12. Sensory Integration
- Add support for microphone input to "speak" to your AI
- Implement webcam integration for visual recognition tasks
- Create haptic feedback for touch-based interaction

### 13. Narrative Generation
- Have your AI generate stories about its "experiences"
- Create a narrative visualization of your AI's "life"
- Implement a diary or log system for your AI

### 14. Ethical Framework
- Implement ethical decision-making scenarios
- Create a "moral compass" visualization
- Add dilemmas that test your AI's ethical framework

### 15. Quantum Simulation
- Add quantum-inspired algorithms to your AI's processing
- Implement superposition and entanglement visualizations
- Create quantum-inspired neural networks

## Technical Implementation Notes

To implement the suggested enhancements, you would need to:
1. Add WebAssembly support for local LLM integration
2. Implement more sophisticated neural network algorithms
3. Add WebGL for more complex visualizations
4. Implement local storage for saving AI configurations
5. Add Web Workers for background processing

The modular design of the current codebase makes it relatively straightforward to extend with these new features while maintaining the client-side-only approach.

## License

This project is open source and available under the MIT License.

## Credits

Created as a demonstration of client-side AI simulation using only HTML, CSS, and JavaScript.
