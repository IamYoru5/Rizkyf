document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling untuk navigasi
    document.querySelectorAll('a.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animasi muncul saat di-scroll (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Persentase elemen yang terlihat untuk memicu animasi
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Berhenti mengamati setelah terlihat
            }
        });
    }, observerOptions);

    // Tambahkan kelas 'hidden' ke semua section (kecuali home) untuk animasi awal
    document.querySelectorAll('section:not(#home)').forEach(section => {
        section.classList.add('hidden');
        observer.observe(section);
    });

    // Anda bisa menambahkan logika animasi untuk elemen lain di sini,
    // misalnya untuk project-card atau elemen form.
    document.querySelectorAll('.project-card').forEach(card => {
        card.classList.add('hidden');
        observer.observe(card);
    });

    document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form button').forEach(el => {
        el.classList.add('hidden');
        observer.observe(el);
    });

    document.querySelectorAll('.social-links a').forEach(link => {
        link.classList.add('hidden');
        observer.observe(link);
    });


    // Fungsionalitas detail keahlian dengan overlay dan animasi zoom
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('click', function() {
            const skillId = this.dataset.skill; // e.g., 'konfigurasi', 'troubleshooting'

            // Data detail keahlian
            const skillDetails = {
                konfigurasi: {
                    title: 'Konfigurasi Jaringan',
                    description: 'Mampu melakukan konfigurasi perangkat jaringan seperti router, switch, firewall, dan access point dari berbagai vendor (Cisco, Mikrotik, Juniper, dll.) untuk membangun infrastruktur jaringan yang stabil dan aman.',
                    listItems: [
                        'Router (Static, Dynamic Routing - OSPF, EIGRP, BGP)',
                        'Switch (VLAN, STP, EtherChannel)',
                        'Firewall (ACL, NAT, VPN)',
                        'Wireless (WPA2/3, SSID management)'
                    ]
                },
                troubleshooting: {
                    title: 'Troubleshooting Jaringan',
                    description: 'Ahli dalam mengidentifikasi, menganalisis, dan menyelesaikan masalah pada jaringan, mulai dari isu konektivitas dasar hingga permasalahan kompleks pada lapisan protokol.',
                    listItems: [
                        'Menganalisis log perangkat dan paket data',
                        'Menggunakan tools diagnostik jaringan (Wireshark, Ping, Traceroute)',
                        'Memulihkan layanan jaringan dengan cepat'
                    ]
                },
                desain: {
                    title: 'Desain Jaringan',
                    description: 'Berpengalaman dalam merancang arsitektur jaringan yang skalabel, efisien, dan sesuai dengan kebutuhan bisnis atau organisasi, dari konsep awal hingga implementasi.',
                    listItems: [
                        'Perencanaan topologi jaringan (LAN, WAN, Data Center)',
                        'Pemilihan perangkat keras dan perangkat lunak yang optimal',
                        'Dokumentasi jaringan dan perencanaan kapasitas'
                    ]
                }
            };

            const currentSkill = skillDetails[skillId];
            if (!currentSkill) return; // Jika skillId tidak ditemukan, hentikan

            // Cek apakah overlay sudah ada, jika tidak, buat
            let detailOverlay = document.getElementById('global-skill-detail-overlay');
            if (!detailOverlay) {
                detailOverlay = document.createElement('div');
                detailOverlay.id = 'global-skill-detail-overlay';
                detailOverlay.classList.add('skill-detail-overlay');

                const detailContent = document.createElement('div');
                detailContent.classList.add('detail-content');

                const closeButton = document.createElement('button');
                closeButton.classList.add('close-detail-button');
                closeButton.innerHTML = '&times;';
                closeButton.addEventListener('click', () => {
                    detailOverlay.classList.remove('active');
                    // Kembalikan ikon panah pada kartu yang sedang aktif
                    const activeCard = document.querySelector('.skill-card.active-detail-card');
                    if (activeCard) {
                        activeCard.querySelector('.read-more').innerHTML = 'Lihat Detail &darr;';
                        activeCard.classList.remove('active-detail-card');
                    }
                });

                detailContent.appendChild(closeButton);
                detailOverlay.appendChild(detailContent);
                document.body.appendChild(detailOverlay); // Tambahkan ke body agar bisa overlay seluruh halaman

                // Tambahkan event listener untuk menutup saat klik di luar konten
                detailOverlay.addEventListener('click', (event) => {
                    // Pastikan klik hanya terjadi di luar detail-content (bukan pada children-nya)
                    if (event.target === detailOverlay) {
                        detailOverlay.classList.remove('active');
                        const activeCard = document.querySelector('.skill-card.active-detail-card');
                        if (activeCard) {
                            activeCard.querySelector('.read-more').innerHTML = 'Lihat Detail &darr;';
                            activeCard.classList.remove('active-detail-card');
                        }
                    }
                });
            }

            // Dapatkan elemen detail-content di dalam overlay
            const detailContentEl = detailOverlay.querySelector('.detail-content');
            // Kosongkan konten lama kecuali tombol tutup yang sudah ada
            detailContentEl.innerHTML = '';
            const existingCloseButton = detailOverlay.querySelector('.close-detail-button');
            if (existingCloseButton) {
                detailContentEl.appendChild(existingCloseButton); // Tambahkan kembali tombol tutup yang sudah ada
            }


            // Isi konten pop-up dengan data skill yang dipilih
            const titleEl = document.createElement('h4');
            titleEl.textContent = currentSkill.title;
            detailContentEl.appendChild(titleEl);

            const descriptionEl = document.createElement('p');
            descriptionEl.textContent = currentSkill.description;
            detailContentEl.appendChild(descriptionEl);

            const ulEl = document.createElement('ul');
            currentSkill.listItems.forEach(itemText => {
                const liEl = document.createElement('li');
                liEl.textContent = itemText;
                ulEl.appendChild(liEl);
            });
            detailContentEl.appendChild(ulEl);

            // Hapus kelas 'active-detail-card' dari semua kartu sebelumnya
            document.querySelectorAll('.skill-card').forEach(c => c.classList.remove('active-detail-card'));
            // Tambahkan kelas 'active-detail-card' ke kartu yang sedang dibuka
            this.classList.add('active-detail-card');


            // Tampilkan overlay
            detailOverlay.classList.add('active');

            // Ubah ikon panah ke atas pada card yang diklik
            this.querySelector('.read-more').innerHTML = 'Sembunyikan &uarr;';
        });
    });

    // --- Placeholder untuk integrasi robot 3D ---
    /*
    if (typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000); // Sesuaikan ukuran container
        const renderer = new THREE.WebGLRenderer({ alpha: true }); // alpha: true untuk latar belakang transparan
        renderer.setSize(300, 300);
        document.getElementById('robot-3d-container').innerHTML = ''; // Hapus placeholder
        document.getElementById('robot-3d-container').appendChild(renderer.domElement);

        // Contoh: Kubus sederhana sebagai pengganti robot
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x87CEEB, wireframe: true });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 2;

        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();
    }
    */
});