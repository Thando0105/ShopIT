const projects = [
    { id: 1, title: "E-commerce System", img: "http://127.0.0.1:5502/images/image.png", desc: "iStore Resellers Advanced retail platform." },
    { id: 2, title: "Modern Portfolio", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600", desc: "Clean business presence." }
];

function render() {
    const grid = document.getElementById('portfolio-grid');
    if(!grid) return;
    grid.innerHTML = projects.map(p => `
        <div class="project-card">
            <img src="${p.img}" style="width:100%; height:200px; object-fit:cover;">
            <div style="padding:20px">
                <h3>${p.title}</h3>
                <p style="color:#94a3b8; margin:10px 0">${p.desc}</p>
                <button class="btn btn-primary full-width" onclick="alert('Order like this on WhatsApp!')">View Details</button>
            </div>
        </div>
    `).join('');
}

window.onscroll = () => {
    document.querySelector('.navbar').classList.toggle('scrolled', window.scrollY > 50);
};

document.addEventListener('DOMContentLoaded', render);

