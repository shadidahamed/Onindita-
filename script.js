document.addEventListener("DOMContentLoaded", () => {
    
    // --- THREE.JS ENGINE CONFIGURATION ---
    const container = document.getElementById('three-canvas');
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ canvas: container, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const heartVertices = [];
    const totalPoints = 500; 

    // Heart Equation Mathematical Array Gen Loop
    for (let i = 0; i < totalPoints; i++) {
        const t = (i / totalPoints) * Math.PI * 2;
        
        // Exact Cartesian Formula matching plot data geometry
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        const z = (Math.random() - 0.5) * 1.0; 

        // Proportioned scaling factor to center lock layout inside canvas borders
        heartVertices.push(new THREE.Vector3(x * 0.435, y * 0.435, z));
    }

    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(totalPoints * 3);

    // Initialise all vector positions tracking smoothly to central origin
    for(let i=0; i<totalPoints; i++) {
        positions[i*3] = heartVertices[0].x;
        positions[i*3+1] = heartVertices[0].y;
        positions[i*3+2] = heartVertices[0].z;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0xff2a74,
        size: 0.28,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Adjusting particle layout height center balance matching CSS transform matrices
    particleSystem.position.y = 0.5;

    // --- CINEMATIC SEQUENCE TIMELINE ENGINE ---
    let constructionProgress = 0;
    let animationComplete = false;
    
    // Core parameters governing the 3D local orbit loop speed
    let targetRotationY = 0;
    let targetRotationX = 0;
    const rotationObject = { y: 0, x: 0 }; 

    const introTimeline = gsap.timeline();
    
    introTimeline.to({val: 0}, {
        val: 1,
        duration: 4.2,
        ease: "power2.out",
        onUpdate: function() {
            constructionProgress = this.targets()[0].val;
        },
        onComplete: () => {
            animationComplete = true;
            revealPhotoFrame();
        }
    });

    // Unified Render Loop Engine handling Three.js and CSS 3D Matrix Parallax syncing
    function animate() {
        requestAnimationFrame(animate);

        const currentPositions = particleGeometry.attributes.position.array;

        // Perform initial constellation line growth calculation
        for (let i = 0; i < totalPoints; i++) {
            const targetActivationIndex = totalPoints * constructionProgress;
            
            if (i < targetActivationIndex) {
                currentPositions[i * 3] = THREE.MathUtils.lerp(currentPositions[i * 3], heartVertices[i].x, 0.07);
                currentPositions[i * 3 + 1] = THREE.MathUtils.lerp(currentPositions[i * 3 + 1], heartVertices[i].y, 0.07);
                currentPositions[i * 3 + 2] = THREE.MathUtils.lerp(currentPositions[i * 3 + 2], heartVertices[i].z, 0.07);
            }
        }
        particleGeometry.attributes.position.needsUpdate = true;

        // Interactive 3D Rotation engine triggers once construction finishes
        if(animationComplete) {
            const time = Date.now() * 0.001;
            
            // Continuous 360-degree mathematical circular orbit pattern loop
            rotationObject.y = time * 0.4; 
            rotationObject.x = Math.sin(time * 0.5) * 0.15; // Smooth harmonic nodding angle swing

            // Map variables perfectly onto WebGL matrix
            particleSystem.rotation.y = rotationObject.y;
            particleSystem.rotation.x = rotationObject.x;

            // Map exact matching variables onto the HTML Photo container wrapper
            const frame = document.getElementById('heartFrame');
            if (frame) {
                // Convert radians directly to clean CSS rotation angles
                const degY = (rotationObject.y * (180 / Math.PI)) % 360;
                const degX = rotationObject.x * (180 / Math.PI);
                
                // We keep translate(-50%, -50%) to ensure it centers flawlessly on any screen size
                frame.style.transform = `translate(-50%, -50%) scale(1) rotateY(${degY}deg) rotateX(${degX}deg)`;
            }
        }

        renderer.render(scene, camera);
    }
    
    animate();

    function revealPhotoFrame() {
        const frame = document.getElementById('heartFrame');
        const btn = document.getElementById('btnProceed');

        // Smoothly bring the heart frame to life at scale(1)
        gsap.to(frame, {
            opacity: 1,
            duration: 1.5,
            ease: "power2.out"
        });

        gsap.to(btn, {
            opacity: 1,
            translateY: 0,
            duration: 1,
            delay: 0.3,
            ease: "back.out(1.5)"
        });
    }

    // Interactive Mouse & Gyro Floating 3D Parallax system inside the heart container
    window.addEventListener('mousemove', (e) => {
        if (!animationComplete) return;

        // Calculate normalized device coordinates (-1 to 1) from the center of the viewport
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;

        // Offset the image texture slightly within its boundaries to create depth separation
        gsap.to('.family-photo', {
            x: nx * 15,
            y: -ny * 15,
            duration: 0.6,
            ease: "power1.out"
        });
    });

    // --- VIEW CONTROLLER ---
    document.getElementById('btnProceed').addEventListener('click', () => {
        const stageOne = document.getElementById('stage-one');
        const stageTwo = document.getElementById('stage-two');

        gsap.to(stageOne, {
            opacity: 0,
            scale: 0.92,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: () => {
                stageOne.classList.add('hidden');
                stageTwo.classList.remove('hidden');
                
                gsap.to('.glass-card', {
                    opacity: 1,
                    translateY: 0,
                    duration: 1.2,
                    ease: "power4.out"
                });
            }
        });
    });

    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
});