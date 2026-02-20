document.addEventListener('DOMContentLoaded', function () {

    // 1. Navbar Scrolled State
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Smooth Scroll & Close Offcanvas
    const navLinks = document.querySelectorAll('.nav-link, .btn-cta');
    const offcanvasElement = document.getElementById('offcanvasNavbar');
    const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                if (window.innerWidth < 992 && offcanvasElement.classList.contains('show')) {
                    bsOffcanvas.hide();
                }
            }
        });
    });

    // 3. Scrollspy Manual
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = '#' + section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    });

    // 4. Form Submit via Web3Forms (AJAX sem redirecionar)
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            // Se não achou a div de status, evita quebrar o JS
            if (!statusDiv) return;

            if (!form.checkValidity()) {
                event.stopPropagation();
                form.classList.add('was-validated');
                statusDiv.innerHTML = '';
                return;
            }

            form.classList.add('was-validated');
            statusDiv.innerHTML = '<div class="alert alert-info mt-3">Enviando...</div>';

            const formData = new FormData(form);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                const result = await response.json();

                if (result.success) {
                    statusDiv.innerHTML =
                        '<div class="alert alert-success mt-3">Mensagem enviada com sucesso! Entraremos em contato.</div>';
                    form.reset();
                    form.classList.remove('was-validated');
                } else {
                    statusDiv.innerHTML =
                        '<div class="alert alert-danger mt-3">Erro ao enviar: ' + (result.message || 'tente novamente') + '</div>';
                }
            } catch (error) {
                statusDiv.innerHTML =
                    '<div class="alert alert-danger mt-3">Falha de conexão ao enviar. Tente novamente.</div>';
            }
        });
    }



    // 5. Back to Top Button (Refatorado para usar Classes)
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            // CORREÇÃO: Usar classe em vez de style.display
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
