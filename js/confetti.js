/* Modified Version by FoolyCoolySAP */

let maxParticleCount = 150,	//set max confetti count
	particleSpeed = 2;		//set the particle animation speed
/*	startConfetti,			//call to start confetti animation
	stopConfetti,			//call to stop adding confetti
	toggleConfetti,			//call to start or stop the confetti animation depending on whether it's already running
	removeConfetti;			//call to stop the confetti animation and remove all confetti immediately
*/

(function() {
/*	startConfetti = startConfettiInner;
	stopConfetti = stopConfettiInner;
	toggleConfetti = toggleConfettiInner;
	removeConfetti = removeConfettiInner;
*/

	let colors = ['DodgerBlue', 'OliveDrab', 'Gold', 'Pink', 'SlateBlue', 'LightBlue', 'Violet', 'PaleGreen', 'SteelBlue', 'SandyBrown', 'Chocolate', 'Crimson'],
		streamingConfetti = false,
		animationTimer = null,
		particles = [],
		waveAngle = 0;
	startConfettiInner();

	function resetParticle(particle, width, height) {
		particle.color = colors[(Math.random() * colors.length) | 0];
		particle.x = Math.random() * width;
		particle.y = Math.random() * height - height;
		particle.diameter = Math.random() * 10 + 5;
		particle.tilt = Math.random() * 10 - 10;
		particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
		particle.tiltAngle = 0;
		return particle;
	}

	function startConfettiInner() {
		let width = window.innerWidth,
			height = window.innerHeight,
			canvas = document.createElement('canvas'),
			context = canvas.getContext("2d");

		canvas.width = width,
		canvas.height = height,
		canvas.id = 'confetti-canvas';
		canvas.setAttribute('style', 'display:block;position:fixed;z-index:-1;pointer-events:none');
		document.getElementById('background').appendChild(canvas);
		window.addEventListener("resize", function() {
			canvas.width = window.innerWidth,
			canvas.height = window.innerHeight;
		}, true);

		window.requestAnimFrame = (function() {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback) { return window.setTimeout(callback, 16.6666667); };
		})();

		while (particles.length < maxParticleCount)
			particles.push(resetParticle({}, width, height));

		streamingConfetti = true;
		if (animationTimer === null) {
			(function runAnimation() {
				context.clearRect(0, 0, window.innerWidth, window.innerHeight);
				if (particles.length === 0)
					animationTimer = null;
				else {
					updateParticles();
					drawParticles(context);
					animationTimer = requestAnimFrame(runAnimation);
				}
			})();
		}
	}

	function stopConfettiInner() { streamingConfetti = false; }

	function removeConfettiInner() { stopConfettiInner(); particles = []; }

	function toggleConfettiInner() { (streamingConfetti) ? stopConfettiInner() : startConfettiInner(); }

	function drawParticles(context) {
		for (let i = 0; i < particles.length; i++) {
			context.beginPath();
			context.lineWidth = particles[i].diameter;
			context.strokeStyle = particles[i].color;
			var x = particles[i].x + particles[i].tilt;
			context.moveTo(x + particles[i].diameter / 2, particles[i].y);
			context.lineTo(x, particles[i].y + particles[i].tilt + particles[i].diameter / 2);
			context.stroke();
		}
	}

	function updateParticles() {
		waveAngle += 0.01;
		for (let i = 0; i < particles.length; i++) {
			if (!streamingConfetti && particles[i].y < -15)
				particles[i].y = window.innerHeight + 100;
			else {
				particles[i].tiltAngle += particles[i].tiltAngleIncrement;
				particles[i].x += Math.sin(waveAngle);
				particles[i].y += (Math.cos(waveAngle) + particles[i].diameter + particleSpeed) * 0.5;
				particles[i].tilt = Math.sin(particles[i].tiltAngle) * 15;
			}
			if (particles[i].x > window.innerWidth + 20 || particles[i].x < -20 || particles[i].y > window.innerHeight) {
				if (streamingConfetti && particles.length <= maxParticleCount)
					resetParticle(particles[i], window.innerWidth, window.innerHeight);
				else {
					particles.splice(i, 1);
					i--;
				}
			}
		}
	}
})();