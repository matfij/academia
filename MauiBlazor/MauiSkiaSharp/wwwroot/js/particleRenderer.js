export function drawParticles(particles) {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    ctx.fillStyle = "white";
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.X * 10, p.Y * 10, 5, 0, 2 * Math.PI);
        ctx.fill();
    });
}
