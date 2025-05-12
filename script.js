// Main Application Object
const AnimationStudio = {
    // Configuration and State
    state: {
        theme: 'light',
        animationCount: 0,
        animationSpeed: 1,
        soundEnabled: true,
        accentColor: '#3498db'
    },

    // Initialization Method
    init() {
        // Bind all event listeners
        this.bindEvents();
        
        // Load saved preferences
        this.loadPreferences();
        
        // Setup initial state
        this.setupTheme();
        this.setupAnimationSpeed();
        this.setupSounds();
        this.setupCanvas();
        this.setupAnimationTriggers();
        this.setupWelcomeModal();
        this.setupStaggerAnimation();
        this.setupTransformations();
    },

    // Event Binding
    bindEvents() {
        // Theme Toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Accent Color Picker
        document.getElementById('accentColor').addEventListener('input', (e) => this.updateAccentColor(e.target.value));

        // Animation Speed Control
        const speedSlider = document.getElementById('animationSpeed');
        speedSlider.addEventListener('input', (e) => this.updateAnimationSpeed(e.target.value));

        // Sound Controls
        document.getElementById('playSound').addEventListener('click', () => this.playSound());
        document.getElementById('stopSound').addEventListener('click', () => this.stopSound());
    },

    // Theme Management
    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        this.setupTheme();
        this.savePreferences();
    },

    setupTheme() {
        const themeIcon = document.querySelector('.theme-icon');
        const body = document.body;

        if (this.state.theme === 'dark') {
            body.classList.add('dark-theme');
            themeIcon.textContent = '🌙';
        } else {
            body.classList.remove('dark-theme');
            themeIcon.textContent = '🌞';
        }
    },

    // Color Management
    updateAccentColor(color) {
        this.state.accentColor = color;
        document.documentElement.style.setProperty('--primary-color', color);
        this.savePreferences();
    },

    // Animation Speed Control
    updateAnimationSpeed(speed) {
        this.state.animationSpeed = parseFloat(speed);
        document.getElementById('speedValue').textContent = `${speed}x`;
        
        // Apply speed to CSS animations
        document.documentElement.style.setProperty('--transition-speed', `${0.3 / speed}s`);
        
        this.savePreferences();
    },

    // Sound Management
    setupSounds() {
        this.sounds = {
            bell: new Audio('./bell.wav'),
            pop: new Audio('./pop.wav'),
            drum: new Audio('./drum.wav')
        };
    },

    playSound() {
        if (!this.state.soundEnabled) return;

        const soundSelector = document.getElementById('soundSelector');
        const selectedSound = this.sounds[soundSelector.value];
        
        if (selectedSound) {
            selectedSound.currentTime = 0;
            selectedSound.play();
        }
    },

    stopSound() {
        Object.values(this.sounds).forEach(sound => sound.pause());
    },

    // Drawing Canvas
    setupCanvas() {
        const canvas = document.getElementById('drawingCanvas');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        function draw(e) {
            if (!isDrawing) return;
            
            const brushColor = document.getElementById('brushColor').value;
            const brushSize = document.getElementById('brushSize').value;
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.strokeStyle = brushColor;
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.stroke();
            
            [lastX, lastY] = [e.offsetX, e.offsetY];
        }

        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });

        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseout', () => isDrawing = false);

        document.getElementById('clearCanvas').addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    },

    // Stagger Animation
    setupStaggerAnimation() {
        const staggerContainer = document.getElementById('cardStagger');
        const staggerItems = staggerContainer.querySelectorAll('.stagger-item');

        function animateStagger() {
            staggerItems.forEach((item, index) => {
                item.animate([
                    { transform: 'scale(0)', opacity: 0 },
                    { transform: 'scale(1)', opacity: 1 }
                ], {
                    duration: 500,
                    delay: index * 100,
                    fill: 'forwards',
                    easing: 'ease-out'
                });
            });
        }

        // Trigger on hover
        staggerContainer.addEventListener('mouseenter', animateStagger);
    },

    // Transformation Animations
    setupTransformations() {
        const transformBox = document.querySelector('.transform-box');
        const transitionButton = document.querySelector('.transition-button');

        // Advanced transform on click
        transformBox.addEventListener('click', () => {
            transformBox.animate([
                { transform: 'rotate(0deg) scale(1)' },
                { transform: 'rotate(360deg) scale(1.5)' }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0.5, 0, 0.75, 1)',
                fill: 'forwards'
            });
        });

        // Complex transition button
        transitionButton.addEventListener('mouseenter', () => {
            transitionButton.animate([
                { transform: 'translateY(0)' },
                { transform: 'translateY(-10px)' }
            ], {
                duration: 300,
                easing: 'ease-out'
            });
        });
    },

    // Animation Triggers
    setupAnimationTriggers() {
        const animationTarget = document.getElementById('animationTarget');
        const shakeButton = document.getElementById('shakeButton');
        const pulseButton = document.getElementById('pulseButton');
        const rotateButton = document.getElementById('rotateButton');

        const animationTypes = [
            { button: shakeButton, animationClass: 'shake-animation' },
            { button: pulseButton, animationClass: 'pulse-animation' },
            { button: rotateButton, animationClass: 'rotate-animation' }
        ];

        animationTypes.forEach(({ button, animationClass }) => {
            button.addEventListener('click', () => {
                // Remove previous animations
                animationTarget.classList.remove('shake-animation', 'pulse-animation', 'rotate-animation');
                
                // Trigger new animation
                void animationTarget.offsetWidth; // Trigger reflow
                animationTarget.classList.add(animationClass);

                // Update performance stats
                this.state.animationCount++;
                document.getElementById('animationCount').textContent = this.state.animationCount;
                document.getElementById('lastAnimationType').textContent = animationClass.replace('-animation', '');
            });
        });
    },

    // Welcome Modal
    setupWelcomeModal() {
        const modal = document.getElementById('welcomeModal');
        const closeModal = document.querySelector('.close-modal');
        const startExploring = document.getElementById('startExploring');

        // Show modal on first visit
        if (!localStorage.getItem('visited')) {
            modal.style.display = 'block';
            localStorage.setItem('visited', 'true');
        }

        // Close modal events
        closeModal.addEventListener('click', () => modal.style.display = 'none');
        startExploring.addEventListener('click', () => modal.style.display = 'none');

        // Close modal if clicked outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    },

    // Preferences Management
    savePreferences() {
        localStorage.setItem('animationStudioPreferences', JSON.stringify(this.state));
    },

    loadPreferences() {
        const savedPreferences = localStorage.getItem('animationStudioPreferences');
        if (savedPreferences) {
            const preferences = JSON.parse(savedPreferences);
            
            // Apply saved preferences
            this.state = { ...this.state, ...preferences };
            
            // Update UI to reflect saved preferences
            document.getElementById('accentColor').value = this.state.accentColor;
            document.getElementById('animationSpeed').value = this.state.animationSpeed;
            document.getElementById('speedValue').textContent = `${this.state.animationSpeed}x`;
            
            // Reapply theme and color
            this.setupTheme();
            this.updateAccentColor(this.state.accentColor);
        }
    }
};

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    AnimationStudio.init();
});

// Performance Monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page load time: ${loadTime.toFixed(2)} ms`);
});

// Error Handling
window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    
});
