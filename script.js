/* ============================================================
   蒋芷颖 | 艺术与科技 — 个人作品集网站
   script.js — 交互脚本
   功能：粒子动画 / 导航 / 弹窗 / 表单 / 滚动渐入 / 计数
   ============================================================ */

(function () {
    'use strict';

    // ============================================================
    // 1. 导航栏移动端菜单
    // ============================================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // 点击导航链接后关闭菜单
        document.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ============================================================
    // 2. 导航栏滚动样式 + 当前章节高亮
    // ============================================================
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function () {
        // 滚动时添加阴影
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 当前章节高亮
        let current = '';
        sections.forEach(function (section) {
            var top = section.offsetTop - 100;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ============================================================
    // 3. Hero 粒子动画（Canvas）
    // ============================================================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var particles = [];
        var mouse = { x: null, y: null };

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', function () {
            resizeCanvas();
            initParticles();
        });

        // 粒子类
        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }

        Particle.prototype.update = function () {
            this.x += this.speedX;
            this.y += this.speedY;

            // 边界反弹
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // 鼠标交互 — 粒子被轻微吸引
            if (mouse.x !== null) {
                var dx = mouse.x - this.x;
                var dy = mouse.y - this.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    this.x += dx * 0.005;
                    this.y += dy * 0.005;
                }
            }
        };

        Particle.prototype.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(26, 26, 46, ' + this.opacity + ')';
            ctx.fill();
        };

        function initParticles() {
            particles = [];
            var count = Math.min(80, Math.floor(canvas.width * canvas.height / 12000));
            for (var i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        // 粒子连线
        function connectParticles() {
            for (var a = 0; a < particles.length; a++) {
                for (var b = a + 1; b < particles.length; b++) {
                    var dx = particles[a].x - particles[b].x;
                    var dy = particles[a].y - particles[b].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.strokeStyle = 'rgba(15, 52, 96, ' + (0.12 * (1 - dist / 100)) + ')';
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
        }

        // 动画循环
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(function (p) {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();

        // 鼠标位置追踪
        var heroSection = document.getElementById('hero');
        heroSection.addEventListener('mousemove', function (e) {
            var rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        heroSection.addEventListener('mouseleave', function () {
            mouse.x = null;
            mouse.y = null;
        });
    }

    // ============================================================
    // 4. 滚动渐入动画（IntersectionObserver）
    // ============================================================
    var fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('section').forEach(function (el) {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
    });

    // ============================================================
    // 5. 数字计数动画
    // ============================================================
    var statObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var target = parseInt(el.getAttribute('data-count'));
                var suffix = el.textContent.replace(/[\d.]/g, '') || '';
                var current = 0;
                var step = Math.max(1, Math.ceil(target / 30));
                var timer = setInterval(function () {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = current + suffix;
                }, 40);
                statObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(function (el) {
        statObserver.observe(el);
    });

    // ============================================================
    // 6. Hero 视差效果
    // ============================================================
    var heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', function () {
        var scrolled = window.pageYOffset;
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 1.2;
        }
    });

    // ============================================================
    // 7. 作品弹窗数据
    // ============================================================
    var modalData = {
        popmart: {
            title: 'POP MART ROBO SHOP',
            subtitle: 'Blender 快闪店空间设计',
            image: 'images/work1.jpg',
            desc: '以 POP MART 品牌调性为出发点的快闪店空间设计。运用 Blender 进行三维建模与渲染，' +
                  '将机器人元素与零售空间结合，打造充满未来感与趣味性的沉浸式购物体验。' +
                  '空间布局兼顾展示功能与互动体验，色彩方案采用品牌标志性配色。',
            tags: ['Blender', '空间设计', '快闪店', '三维渲染', 'POP MART'],
            download: null
        },
        qingdiesuran: {
            title: '「青叠素染」艺术空间',
            subtitle: '材质与空间设计研究',
            image: 'images/work2.jpg',
            desc: '以青花瓷为主题的艺术空间设计。用亚克力还原白瓷素胎，渐变树脂模拟青花釉色，' +
                  '层层叠叠的结构对应反复上釉的工序。配合动态光影，再现釉色入窑、由浅入深的晕染变化，' +
                  '让千年青花走出器物，在空间里新生流转。',
            tags: ['青花瓷', '空间设计', '材质研究', '动态光影', '亚克力', '树脂'],
            download: null
        },
        wenwu: {
            title: 'TouchDesigner 交互装置',
            subtitle: '数字媒体艺术实验',
            image: 'images/work3.jpg',
            desc: '基于 TouchDesigner 的实时交互视觉装置。通过传感器捕捉观众动作，' +
                  '实时生成动态视觉反馈，探索数字媒体艺术中人与作品的互动关系。' +
                  '项目融合了生成艺术、实时渲染与体感交互技术。',
            tags: ['TouchDesigner', '交互设计', '实时生成', '传感器', '数字媒体'],
            download: null
        },
        more: {
            title: '更多作品',
            subtitle: '持续创作中',
            image: 'images/work4.jpg',
            desc: '更多精彩作品正在整理中，敬请期待。本作品集将持续更新数字艺术、空间设计与交互媒体方向的最新创作。',
            tags: ['持续更新', '数字艺术', '空间设计', '交互媒体'],
            download: null
        }
    };

    // ============================================================
    // 8. 弹窗打开 / 关闭
    // ============================================================
    var modal = document.getElementById('workModal');
    var modalImage = document.getElementById('modalImage');
    var modalTitle = document.getElementById('modalTitle');
    var modalDesc = document.getElementById('modalDesc');
    var modalTags = document.getElementById('modalTags');
    var modalDownload = document.getElementById('modalDownload');

    window.openModal = function (key) {
        var data = modalData[key];
        if (!data) return;

        // 使用真实图片作为弹窗背景
        modalImage.style.background = 'url(' + data.image + ') center / cover no-repeat';
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;

        // 标签
        modalTags.innerHTML = '';
        data.tags.forEach(function (tag) {
            var span = document.createElement('span');
            span.textContent = tag;
            modalTags.appendChild(span);
        });

        // 下载按钮
        if (data.download) {
            modalDownload.href = data.download;
            modalDownload.style.display = 'inline-flex';
            modalDownload.textContent = '下载作品文件';
        } else {
            modalDownload.style.display = 'none';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function () {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // 点击遮罩关闭
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // ESC 关闭
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // ============================================================
    // 9. 联系表单
    // ============================================================
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var inputs = contactForm.querySelectorAll('input, textarea');
            var hasEmpty = false;
            inputs.forEach(function (input) {
                if (!input.value.trim()) hasEmpty = true;
            });

            if (hasEmpty) return;

            // 模拟发送成功
            var btn = contactForm.querySelector('button[type="submit"]');
            var originalText = btn.textContent;
            btn.textContent = '发送中...';
            btn.disabled = true;

            setTimeout(function () {
                btn.textContent = '发送成功 ✓';
                btn.style.background = '#2ecc71';

                setTimeout(function () {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                    contactForm.reset();
                }, 2000);
            }, 1000);
        });
    }

    // ============================================================
    // 10. 平滑滚动（兼容旧浏览器）
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var offset = 64; // 导航栏高度
                var top = target.offsetTop - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

})();
